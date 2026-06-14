# Recipe Evaluator

A hybrid evaluator for recipes produced by the `recipe-format` skill. It grades the four
things we care about (see [ADR 0007](../docs/decisions/0007-recipe-evaluator.md)):

1. **All required fields present** — Layer 1
2. **Follows the guidelines** (ID match, one recipe/file, numbered steps, link resolves) — Layer 1
3. **High quality & simple for beginners** — Layer 2
4. **Engaging** — Layer 2

## Layer 1 — deterministic gate (`validate-recipe.mjs`)

Pure Node, no dependencies. Run it directly:

```bash
# all recipes (online link verification)
node evals/validate-recipe.mjs

# specific files, machine-readable, no network
node evals/validate-recipe.mjs recipes/chicken-biryani.md --offline --json
```

Flags: `--offline` skips the YouTube oEmbed check; `--json` emits a machine-readable report.
Exit code is `0` only if every file passes — so it can gate CI or the loop.

## Layer 2 — qualitative judge (`judge-rubric.md`)

The subjective dimensions (`soundness`, `beginner_friendliness`, `engagement`, `relevance`)
are scored 1–5 by a **Claude Code subagent** using [`judge-rubric.md`](./judge-rubric.md).
Orchestrated in-session (Claude spawns the subagent) — there's no standalone command, by
design (ADR 0007). To run a judge pass, spawn an agent roughly like:

> Read the rubric at `evals/judge-rubric.md` and grade the recipe at
> `recipes/<slug>.md`. The verified video is "<oEmbed title>" by <author>. Return only the
> JSON described in the rubric.

Request the matching JSON schema so the output is validated.

## Combined verdict

A recipe **passes the evaluation** iff:

- the Layer 1 gate fully passes (no `fail` checks), **and**
- every Layer 2 dimension scores **≥ 3** (default threshold).

Layer 1 `warn`s (e.g. slug mismatch) don't fail the gate but are worth fixing.

## The improve loop (roadmap step 5)

```
/recipe-format  ──▶  recipes/<slug>.md  ──▶  Layer 1 gate  ──▶  Layer 2 judge  ──▶  verdict
       ▲                                                                              │
       └───────────────  improve the skill from failing checks + suggestions  ───────┘
```

Run a batch of recipes, collect the failing checks and the judge's suggestions, generalize
them into improvements to `.claude/skills/recipe-format/SKILL.md`, then regenerate and
re-evaluate. Repeat until the gate is clean and the judge consistently scores ≥ 4.

Later, this evaluator can serve as the **grader** inside the skill-creator eval harness.

## Fixtures (`fixtures/`)

Self-tests for the validator, run with `--offline` (they use placeholder video IDs):

```bash
node evals/validate-recipe.mjs evals/fixtures/*.md --offline
```

- `weeknight-chicken-biryani.md` — a well-formed recipe; should **PASS**.
- `bad-recipe.md` — deliberately violates several rules; should **FAIL** (and shows what the
  output looks like when it does).
