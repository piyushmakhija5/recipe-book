# 7. Recipe evaluator: hybrid (deterministic gate + LLM judge)

- **Status:** Accepted
- **Date:** 2026-06-14

## Context

We need to evaluate recipes produced by the `recipe-format` skill so we can run a
generate → evaluate → improve loop (roadmap step 5, and a core learning goal). The success
criteria split into two kinds:

- **Objective** — all required fields present; guidelines followed (image videoID matches
  the YouTube videoID; one recipe per file; numbered steps); and the YouTube link actually
  resolves (the direct test of "never invent URLs").
- **Subjective** — high quality, simple enough for a beginner to follow, and engaging.

A script can't judge "engaging"; an LLM is unreliable and wasteful for "is `servings` a
number." So neither tool alone fits.

## Decision

Build a **hybrid evaluator** in `evals/`:

- **Layer 1 — deterministic gate** (`evals/validate-recipe.mjs`, **Node.js**, zero-dependency):
  parses a recipe file and asserts the objective rules. Verifies the YouTube link online via
  YouTube's keyless **oEmbed** endpoint, with an `--offline` flag to skip the network. Exit
  code 0 iff every file passes, so it can gate CI / the loop.
- **Layer 2 — qualitative judge** (`evals/judge-rubric.md`): a rubric scored 1–5 across
  `soundness`, `beginner_friendliness`, `engagement`, and `relevance`, run as a **Claude Code
  subagent** that returns a structured verdict with evidence and concrete suggestions. (This
  deliberately exercises the "subagents" learning goal.)
- **Verdict:** a recipe passes the eval iff the Layer 1 gate fully passes **and** every Layer 2
  dimension scores ≥ 3 (default threshold). Orchestration is documented in `evals/README.md`
  and driven by Claude in-session.

## Consequences

- Each tool does what it's best at: cheap/repeatable objective checks, judgment-based
  qualitative checks.
- The evaluator is the **grader** for the improve loop, and can later be plugged in as the
  grader inside the skill-creator eval harness.
- **Zero-dependency Node** keeps it runnable with just `node` (no install, no `package.json`
  collision with the future Next.js scaffold). Trade-off: `validate-recipe.mjs` includes a
  small frontmatter parser tuned to our schema rather than a full YAML library; when we
  scaffold the app (which brings `gray-matter`), we can consolidate on that and revisit.
- The subagent judge runs in-session (not headless). If we later want CI grading without a
  Claude Code session, we'd wrap the judge in `claude -p` — noted as a future option.

## Alternatives considered

- **LLM judge only / script only:** rejected — see Context; neither covers all four criteria
  well.
- **Python validator:** rejected to keep the repo single-language with the Next.js app,
  despite easier integration with skill-creator's Python harness.
- **Add `js-yaml`/`gray-matter` now:** deferred to avoid introducing a toolchain before the
  app is scaffolded.
