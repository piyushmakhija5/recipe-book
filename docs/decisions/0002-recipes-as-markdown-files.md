# 2. Recipes are Markdown files with YAML frontmatter

- **Status:** Accepted
- **Date:** 2026-06-14

## Context

We need a place to store recipe content. The app renders one page per recipe, recipes are
authored (partly) by the `recipe-format` skill, and we want the content to be diffable,
reviewable, and easy for both the model and humans to read. A database would add
infrastructure we don't need for a file-sized content set.

## Decision

Store **one recipe per Markdown file** under `recipes/<slug>.md`. Use **YAML frontmatter**
for queryable metadata (title, cuisine, servings, time, image, youtube, and optional
tags/difficulty/nutrition) and the **Markdown body** for ingredients and numbered steps.
`<slug>` is the kebab-cased title and is also the page route.

The full schema lives in [recipe-format-spec.md](../recipe-format-spec.md).

## Consequences

- No database or CMS to run; recipes are version-controlled like code.
- Frontmatter gives us structured, validatable fields (Next.js can fail the build if a
  required field is missing).
- The skill's output and the app's input are the same artifact — one format to maintain.
- Metadata vs. content split: lists (ingredients, steps) read better as Markdown body than
  as frontmatter arrays, and stay easy to author and review.

## Alternatives considered

- **Database (SQLite/Postgres):** overkill for a file-sized, git-tracked content set.
- **One big JSON/YAML file:** worse diffs, harder to render as Markdown, and breaks the
  "one file per recipe" goal.
