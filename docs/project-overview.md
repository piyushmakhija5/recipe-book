# Project Overview

## What we're building

A **recipe book web app**: a simple site with **one page per recipe**. Recipes are stored
as Markdown files with YAML frontmatter, and a Next.js app renders each file as its own
page at `/recipes/<slug>`.

## Why we're building it (learning goals)

This project is a hands-on sandbox for practicing AI-assisted development with Claude Code.
The recipe app is the vehicle; the real goal is to exercise these capabilities end to end:

- **Skill building** — author the `recipe-format` skill that converts a dish idea or a
  YouTube link into a spec-compliant recipe file. (See
  [decisions/0004-recipe-format-skill.md](./decisions/0004-recipe-format-skill.md).)
- **MCP servers** — wire up external capabilities the model can call. First planned server:
  image generation, to replace YouTube thumbnails with generated, relevant recipe images.
  (See [decisions/0005-image-strategy.md](./decisions/0005-image-strategy.md).)
- **Subagents** — delegate parallel/independent work (e.g. researching multiple recipes,
  reviewing output) to focused subagents.
- **Eval loops** — measure and iteratively improve the `recipe-format` skill against test
  cases (does it find a real video? are all required fields present? is the image relevant?).

## Scope

**In scope (now):** the recipe content model, the `recipe-format` skill, a Next.js app that
renders recipes, and the AI workflows above.

**Out of scope (for now):** user accounts, comments/ratings, search beyond basic listing,
a CMS/admin UI, and a database — recipes live as files in the repo.

## Roadmap

A rough order; we'll confirm each step before implementing (per the working agreement).

1. **Foundation (done)** — `CLAUDE.md`, docs, design decisions captured.
2. **Recipe spec lock-in** — finalize `recipe-format-spec.md` and author one sample recipe
   by hand as a reference fixture. _(Pending — a sample fixture now lives in `evals/fixtures/`.)_
3. **`recipe-format` skill (done)** — drafted in `.claude/skills/recipe-format/`.
4. **Next.js app** — scaffold, read `recipes/*.md`, render `/recipes/<slug>` + an index. _(Pending.)_
5. **Eval loop (evaluator built)** — hybrid evaluator in `evals/` (deterministic gate +
   subagent judge). Ready to run the generate → evaluate → improve loop on real recipes.
6. **ImageGen MCP** — add the image server and switch the image strategy. _(Pending.)_

## Key conventions

- **One recipe per file**, `recipes/<slug>.md`, `<slug>` = kebab-cased title.
- **Frontmatter** holds queryable metadata; **body** holds ingredients and numbered steps.
- **Never invent YouTube URLs** — always fetch/verify a real video.
