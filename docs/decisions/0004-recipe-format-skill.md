# 4. The `recipe-format` skill

- **Status:** Accepted
- **Date:** 2026-06-14

## Context

Producing a well-structured recipe file by hand is repetitive: find a real video, derive
the image, fill in all required fields, write numbered steps. This is exactly the kind of
repeatable workflow a Claude **skill** captures, and authoring it is one of the project's
learning goals.

## Decision

Build a project skill, **`recipe-format`**, in `.claude/skills/recipe-format/`. It converts
an input into a single spec-compliant recipe file.

**Inputs it accepts:**
- A **dish name / idea** (e.g. "make me a chicken biryani recipe") — the skill searches
  YouTube for a real, relevant video, then writes the recipe.
- A **YouTube video link** — the skill fetches that specific video and extracts the recipe
  from it.

**Output:** one file at `recipes/<slug>.md`, conforming to
[recipe-format-spec.md](../recipe-format-spec.md).

**Required fields it must always produce:** enticing title, cuisine, servings, numbered
steps, image, YouTube link, time, ingredients. **Optional:** tags, difficulty,
nutrition/macros, notes.

**Hard rules:**
- Never invent a YouTube URL — always fetch and verify (see
  [0006](./0006-youtube-sourcing-rules.md)).
- Image must be relevant — YouTube thumbnail for now (see
  [0005](./0005-image-strategy.md)).
- One recipe per file.

## Process

Per the user's choice, we **draft the skill well** first and iterate informally, rather than
running the full skill-creator eval loop up front. A formal **eval loop** is a later
roadmap item (it's one of the project's learning goals) — see
[project-overview.md](../project-overview.md).

## Consequences

- The skill and the app share one format; the spec is the contract between them.
- The skill depends on web search/fetch tools (to find/verify videos) and, later, the
  ImageGen MCP.
- Drafting-first gets us a usable skill quickly; we accept that quality is validated
  informally until the eval loop is built.
