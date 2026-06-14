# Recipe Book

A small web app that publishes **one page per recipe**. It doubles as a sandbox for
practicing AI-assisted development: building Claude **skills**, wiring up **MCP servers**,
delegating to **subagents**, and running **eval loops**.

## How this project works

Recipes are authored as Markdown files (one per recipe) with YAML frontmatter for
metadata. A Next.js app reads those files and renders one page per recipe. New recipes
are produced by the `recipe-format` skill, which turns a dish idea or a YouTube link into
a correctly-structured recipe file.

```
Idea / YouTube link ──(recipe-format skill)──▶ recipes/<slug>.md ──(Next.js)──▶ /recipes/<slug>
```

## Tech stack

- **App:** Next.js (App Router, React Server Components)
- **Content:** Markdown + YAML frontmatter in `recipes/`, parsed at build time
  (e.g. `gray-matter` + a markdown renderer such as `next-mdx-remote`)
- **AI tooling:** Claude Code skills, MCP servers (an image-generation server is planned),
  subagents, eval loops

## Repo layout

```
recipe-book/
├── CLAUDE.md                  # this file
├── docs/                      # design decisions & specs — read these first
│   ├── project-overview.md    # what we're building + learning goals + roadmap
│   ├── recipe-format-spec.md  # canonical recipe file schema + worked example
│   └── decisions/             # ADRs (one file per decision, with rationale)
├── recipes/                   # one Markdown file per recipe (the content)
├── .claude/skills/            # project skills (recipe-format will live here)
└── app/ (or src/)             # Next.js app (to be scaffolded)
```

## Content model (recipes)

Each recipe is one `recipes/<slug>.md` file. `<slug>` is the kebab-cased title
(e.g. `weeknight-chicken-biryani`) and becomes the page route `/recipes/<slug>`.

- **Required:** enticing title, cuisine, servings, time, image, YouTube link (frontmatter);
  ingredients and numbered steps (body).
- **Optional:** tags, difficulty, nutrition/macros, notes.

The full schema, field rules, and a worked example live in
**`docs/recipe-format-spec.md`** — that file is the source of truth for both the app and
the skill.

## The `recipe-format` skill

Turns a **dish name/idea** or a **YouTube video link** into a single recipe file matching
the spec. Non-negotiable rules:

- **Never invent a YouTube URL.** Always find a real video by searching/fetching YouTube
  and verifying it resolves. If no good video exists, say so rather than fabricate one.
- **Image = the video's YouTube thumbnail** for now
  (`https://img.youtube.com/vi/<id>/maxresdefault.jpg`). An ImageGen MCP server will be
  added later; when it exists, prefer a generated, relevant image and fall back to the
  thumbnail.
- **One recipe per file**, written to `recipes/<slug>.md`, conforming to
  `docs/recipe-format-spec.md`.

See `docs/decisions/0004-recipe-format-skill.md` for the full rationale.

## Evaluating recipes

A hybrid evaluator in `evals/` grades recipes against the four goals (all fields present ·
follows guidelines · high-quality & beginner-friendly · engaging):

- **Layer 1 — deterministic gate:** `node evals/validate-recipe.mjs [files] [--offline] [--json]`
  checks fields/schema, image↔video ID match, numbered steps, one-recipe-per-file, and that
  the YouTube link actually resolves (oEmbed). Exit code 0 iff all pass.
- **Layer 2 — qualitative judge:** a Claude Code subagent scores soundness,
  beginner-friendliness, engagement, and relevance using `evals/judge-rubric.md`.

A recipe passes iff the Layer 1 gate is clean **and** every Layer 2 dimension scores ≥ 3.
See `evals/README.md` and `docs/decisions/0007-recipe-evaluator.md`.

## Working agreement

- **Debate before implementing.** For anything beyond trivial edits — new dependencies,
  config, schema or behavior changes — propose the approach and trade-offs and agree
  before writing code. Don't infer scope from offhand remarks; confirm it.
- **Record decisions.** When we make a design decision, add or update an ADR in
  `docs/decisions/`. Keep `docs/recipe-format-spec.md` in sync if the recipe schema changes.

## Commands

- **Dev server:** `npm run dev` → http://localhost:3000
- **Production build:** `npm run build`
- **Evaluate recipes:** `node evals/validate-recipe.mjs [files] [--offline] [--json]`
