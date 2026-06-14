# 3. Web stack: Next.js

- **Status:** Accepted
- **Date:** 2026-06-14

## Context

We need a web framework to render one page per recipe from the Markdown files in
`recipes/`. The content is largely static, but we want a stack with a large ecosystem that
is good to practice with, and that can grow (interactivity, API routes) if the project
expands.

## Decision

Use **Next.js** (App Router, React Server Components). Recipes are read at build time from
`recipes/*.md`, parsed with a frontmatter parser (e.g. `gray-matter`), and rendered with a
Markdown renderer (e.g. `next-mdx-remote`). Routes:

- `/recipes/<slug>` — one page per recipe (via `generateStaticParams`).
- `/` (or `/recipes`) — an index/listing of all recipes.

## Consequences

- More boilerplate than a pure SSG, but a ubiquitous ecosystem and room to grow.
- We get to practice React Server Components and the App Router.
- We must wire up Markdown parsing/rendering ourselves (no built-in content collections),
  including validating required frontmatter fields against
  [recipe-format-spec.md](../recipe-format-spec.md).

## Alternatives considered

- **Astro:** strongest fit for markdown-driven content (typed content collections validate
  frontmatter automatically, near-zero JS). Rejected in favor of practicing the broader
  React/Next ecosystem.
- **Eleventy (11ty):** minimal and markdown-native, but a smaller ecosystem and less
  React practice value for this project.
