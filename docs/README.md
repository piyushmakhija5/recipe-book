# Docs

Design decisions and specifications for the Recipe Book project. Start here before
making changes.

## Contents

- **[project-overview.md](./project-overview.md)** — what we're building, the learning
  goals behind it, scope, and the rough roadmap.
- **[recipe-format-spec.md](./recipe-format-spec.md)** — the canonical recipe file schema
  (frontmatter + body), field rules, and a worked example. Source of truth for both the
  web app and the `recipe-format` skill.
- **[decisions/](./decisions/)** — Architecture Decision Records (ADRs). One file per
  decision, capturing the context, the choice, and the rationale. See
  [decisions/0001-record-architecture-decisions.md](./decisions/0001-record-architecture-decisions.md)
  for why and how we record these.

## How to use these docs

- When you make a design decision, add a new numbered ADR in `decisions/`.
- When the recipe schema changes, update `recipe-format-spec.md` **and** the relevant ADR.
- Keep the root `CLAUDE.md` as the short, always-loaded summary; keep the depth here.
