# 1. Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-06-14

## Context

This is a learning project as much as a product, and part of the point is to practice good
engineering habits. Design decisions (and the reasoning behind them) are easy to lose if
they live only in chat history. We want a durable, reviewable record.

## Decision

We will keep lightweight **Architecture Decision Records (ADRs)** in `docs/decisions/`,
one Markdown file per decision, numbered sequentially (`0001-...`, `0002-...`). Each ADR
records the **context**, the **decision**, and its **consequences/rationale**. We capture
the *why*, not just the *what*.

When a decision changes, we add a new ADR that supersedes the old one (and mark the old
one superseded) rather than silently editing history.

## Consequences

- Anyone (human or AI) can read `docs/decisions/` and understand how we got here.
- Small overhead per decision — acceptable, and itself good practice to rehearse.
- The root `CLAUDE.md` stays short and links here for depth (progressive disclosure).
