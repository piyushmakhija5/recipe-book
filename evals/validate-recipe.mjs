#!/usr/bin/env node
// Recipe evaluator — Layer 1 (deterministic gate).
//
// Checks the objective rules from docs/recipe-format-spec.md and the guidelines in
// docs/decisions/0004 & 0006. The subjective checks (quality, beginner-friendliness,
// engagement) are handled separately by the Layer 2 judge — see evals/judge-rubric.md.
//
// Usage:
//   node evals/validate-recipe.mjs [files...] [--offline] [--json]
//     (no files)  -> validates all recipes/*.md
//     --offline   -> skip the online YouTube oEmbed check
//     --json      -> machine-readable output (for the loop / CI)
//
// Exit code: 0 if every file PASSES, 1 otherwise.
//
// Zero-dependency by design (see ADR 0007): the frontmatter parser below understands the
// recipe-format subset of YAML, not arbitrary YAML, and fails loudly on anything else.

import { readFile, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';

const REQUIRED = ['title', 'cuisine', 'servings', 'time', 'image', 'youtube'];
const DIFFICULTIES = new Set(['Easy', 'Medium', 'Hard']);

// ---------- frontmatter parser (recipe-format subset) ----------
function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { error: 'no YAML frontmatter block (expected a leading --- ... --- block)' };
  const body = text.slice(m[0].length);
  const lines = m[1].split('\n');
  const data = {};
  let i = 0;
  while (i < lines.length) {
    const raw = lines[i++];
    if (!raw.trim() || /^\s*#/.test(raw)) continue; // blank or full-line comment
    const top = raw.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!top) return { error: `cannot parse frontmatter line: ${JSON.stringify(raw)}` };
    const [, key, rest] = top;
    if (rest === '') {
      // one-level nested map (e.g. time:, nutrition:) — consume indented lines
      const obj = {};
      while (i < lines.length && /^\s+\S/.test(lines[i])) {
        const sub = lines[i++].match(/^\s+([A-Za-z_][\w-]*):\s*(.*)$/);
        if (!sub) return { error: `cannot parse nested line under "${key}"` };
        obj[sub[1]] = parseScalar(sub[2]);
      }
      data[key] = obj;
    } else {
      data[key] = parseScalar(rest);
    }
  }
  return { data, body };
}

function parseScalar(s) {
  s = s.trim();
  if (s.startsWith('[') && s.endsWith(']')) {
    return s.slice(1, -1).split(',').map((x) => stripQuotes(x.trim())).filter((x) => x !== '');
  }
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d*\.\d+$/.test(s)) return parseFloat(s);
  return stripQuotes(s);
}

function stripQuotes(s) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

// ---------- helpers ----------
function slugify(title) {
  return String(title)
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function videoId(url) {
  if (!url) return null;
  try {
    const u = new URL(String(url));
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1) || null;
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const vi = u.pathname.match(/\/vi\/([^/]+)\//); // thumbnail form
    if (vi) return vi[1];
  } catch {
    return null;
  }
  return null;
}

async function oembedResolves(youtubeUrl) {
  const api = `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(api, { signal: ctrl.signal });
    if (!res.ok) return { ok: false, detail: `oEmbed HTTP ${res.status} (video likely missing)` };
    const j = await res.json();
    return { ok: true, title: j.title, author: j.author_name };
  } catch (e) {
    return { ok: false, detail: `oEmbed fetch failed: ${e.message}` };
  } finally {
    clearTimeout(timer);
  }
}

function sectionLines(body, heading) {
  const re = new RegExp(`^##\\s+${heading}\\s*$`, 'im');
  const m = body.match(re);
  if (!m) return [];
  const rest = body.slice(body.indexOf(m[0]) + m[0].length);
  const next = rest.search(/^##\s+/m);
  return (next === -1 ? rest : rest.slice(0, next)).split('\n');
}

// ---------- evaluate one file ----------
async function evaluateFile(file, { offline }) {
  const checks = [];
  const meta = {};
  const add = (id, label, status, detail = '') => checks.push({ id, label, status, detail });
  const finish = () => {
    const failed = checks.filter((c) => c.status === 'fail').length;
    return { file, verdict: failed === 0 ? 'PASS' : 'FAIL', checks, meta };
  };

  let text;
  try {
    text = await readFile(file, 'utf8');
  } catch (e) {
    add('readable', 'File readable', 'fail', e.message);
    return finish();
  }

  const fm = parseFrontmatter(text);
  if (fm.error) {
    add('frontmatter', 'Frontmatter parses', 'fail', fm.error);
    return finish();
  }
  add('frontmatter', 'Frontmatter parses', 'pass');
  const { data, body } = fm;

  // required fields (time is satisfied by time.total)
  for (const key of REQUIRED) {
    const present =
      key === 'time'
        ? data.time && data.time.total != null && data.time.total !== ''
        : data[key] != null && data[key] !== '';
    add(`required:${key}`, `Has ${key === 'time' ? 'time.total' : key}`, present ? 'pass' : 'fail',
      present ? '' : 'missing or empty');
  }

  // types
  add('type:servings', 'servings is a positive integer',
    Number.isInteger(data.servings) && data.servings > 0 ? 'pass' : 'fail',
    `got ${JSON.stringify(data.servings)}`);
  if (data.difficulty != null && data.difficulty !== '') {
    add('type:difficulty', 'difficulty is Easy|Medium|Hard',
      DIFFICULTIES.has(data.difficulty) ? 'pass' : 'fail', `got ${JSON.stringify(data.difficulty)}`);
  }

  // body: ingredients
  const ingHeading = /^##\s+Ingredients\s*$/im.test(body);
  const ingItems = sectionLines(body, 'Ingredients').filter((l) => /^\s*-\s+\S/.test(l));
  add('body:ingredients', 'Ingredients section with >=1 bulleted item',
    ingHeading && ingItems.length > 0 ? 'pass' : 'fail',
    ingHeading ? `${ingItems.length} items` : 'no "## Ingredients" section');

  // body: steps (numbered)
  const stepHeading = /^##\s+Steps\s*$/im.test(body);
  const stepItems = sectionLines(body, 'Steps').filter((l) => /^\s*\d+\.\s+\S/.test(l));
  add('body:steps', 'Steps section with numbered steps',
    stepHeading && stepItems.length > 0 ? 'pass' : 'fail',
    stepHeading ? `${stepItems.length} steps` : 'no "## Steps" section');
  if (stepItems.length) {
    const nums = stepItems.map((l) => parseInt(l.trim(), 10));
    const sequential = nums.every((n, idx) => n === idx + 1);
    add('body:steps-sequential', 'Steps numbered 1..n', sequential ? 'pass' : 'warn',
      sequential ? '' : `numbering: ${nums.join(', ')}`);
  }

  // single recipe per file
  const ingCount = (body.match(/^##\s+Ingredients\s*$/gim) || []).length;
  const stepCount = (body.match(/^##\s+Steps\s*$/gim) || []).length;
  add('single-recipe', 'Exactly one recipe (one Ingredients + one Steps section)',
    ingCount === 1 && stepCount === 1 ? 'pass' : 'fail',
    `Ingredients x${ingCount}, Steps x${stepCount}`);

  // slug matches title (warn — cosmetic, doesn't break rendering)
  const expectedSlug = slugify(data.title);
  const actualSlug = basename(file).replace(/\.md$/, '');
  add('slug', 'Filename matches kebab-cased title',
    expectedSlug === actualSlug ? 'pass' : 'warn', `file="${actualSlug}" expected="${expectedSlug}"`);

  // image & youtube point at the same video
  const ytId = videoId(data.youtube);
  const imgId = videoId(data.image);
  meta.videoId = ytId;
  add('ids-match', 'image and youtube reference the same video ID',
    ytId && imgId && ytId === imgId ? 'pass' : 'fail', `youtube=${ytId} image=${imgId}`);

  // youtube actually resolves (the "never invent URLs" test)
  if (offline) {
    add('youtube-resolves', 'YouTube link resolves (oEmbed)', 'skip', '--offline');
  } else if (!data.youtube) {
    add('youtube-resolves', 'YouTube link resolves (oEmbed)', 'fail', 'no youtube url');
  } else {
    const r = await oembedResolves(data.youtube);
    if (r.ok) {
      meta.oembedTitle = r.title;
      meta.oembedAuthor = r.author;
    }
    add('youtube-resolves', 'YouTube link resolves (oEmbed)', r.ok ? 'pass' : 'fail',
      r.ok ? `"${r.title}" - ${r.author}` : r.detail);
  }

  return finish();
}

// ---------- main ----------
const argv = process.argv.slice(2);
const offline = argv.includes('--offline');
const asJson = argv.includes('--json');
let files = argv.filter((a) => !a.startsWith('--'));

if (files.length === 0) {
  try {
    const entries = await readdir('recipes');
    files = entries.filter((f) => f.endsWith('.md')).map((f) => join('recipes', f));
  } catch {
    files = [];
  }
}
if (files.length === 0) {
  console.error('No recipe files to evaluate (pass file paths, or add files to recipes/).');
  process.exit(1);
}

const results = [];
for (const f of files) results.push(await evaluateFile(f, { offline }));
const summary = {
  total: results.length,
  passed: results.filter((r) => r.verdict === 'PASS').length,
  failed: results.filter((r) => r.verdict === 'FAIL').length,
};

if (asJson) {
  console.log(JSON.stringify({ results, summary }, null, 2));
} else {
  const icon = (s) => ({ pass: '✓', fail: '✗', warn: '!', skip: '·' }[s] || '?');
  for (const r of results) {
    console.log(`\n${r.verdict === 'PASS' ? '✓ PASS' : '✗ FAIL'}  ${r.file}`);
    for (const c of r.checks) {
      console.log(`   ${icon(c.status)} ${c.label}${c.detail ? `  — ${c.detail}` : ''}`);
    }
  }
  console.log(`\n${summary.passed}/${summary.total} passed, ${summary.failed} failed.`);
}
process.exit(summary.failed === 0 ? 0 : 1);
