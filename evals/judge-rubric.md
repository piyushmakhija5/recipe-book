# Recipe Judge Rubric — Layer 2 (qualitative)

You are grading **one** recipe file from the recipe book. A separate script already checked
the objective rules (required fields, schema, image/video ID match, link resolves) — **do
not re-check those**. Your job is what only a careful reader can judge: is this a
high-quality, beginner-friendly, engaging recipe that follows the project's intent?

## Input

You'll be given the **path to a recipe Markdown file** (and possibly the verified video's
title/author). Read the whole file before scoring.

## Score each dimension 1–5 (integers)

### `soundness` — is the recipe correct and complete?
- **5** — Ingredients and steps are complete, coherent, and technically correct; quantities
  make sense for the stated `servings`; every ingredient is used; nothing essential missing.
- **3** — Mostly right but with a gap: a missing quantity, a vague step, or an ingredient
  that's listed but never used.
- **1** — Incoherent or contradictory; missing core ingredients or steps.

### `beginner_friendliness` — could a nervous first-timer follow this?
- **5** — Each step does one main thing and is unambiguous; quantities are explicit; any
  technique or jargon (e.g. "dum", "fold", "deglaze", "blanch") is explained or avoided;
  order is sensible; no assumed knowledge.
- **3** — Followable, but some steps are overloaded or assume a technique without explaining it.
- **1** — Terse, jargon-heavy, or out of order; a beginner would get stuck.

### `engagement` — does it make you want to cook it?
- **5** — Title is enticing and specific (not just the bare dish name); framing and/or notes
  are inviting; tone is warm without being padded.
- **3** — Functional but flat: a generic title, no personality.
- **1** — Dull or off-putting.

### `relevance` — do the dish, title, and source line up?
- **5** — Title and recipe clearly match the dish, and the linked video (by its title/author)
  is a faithful source for this exact recipe.
- **3** — Roughly matches, but the video is a loose fit (a different variant of the dish).
- **1** — Mismatch: the video/image doesn't correspond to the recipe.

## For each dimension, give
- the integer **score**
- 1–2 sentences of **evidence**, pointing to or quoting specifics in the file
- a concrete **suggestion** to raise it (omit if already 5)

## Output — return ONLY this JSON

```json
{
  "file": "<path>",
  "scores": { "soundness": 0, "beginner_friendliness": 0, "engagement": 0, "relevance": 0 },
  "evidence": {
    "soundness": "...",
    "beginner_friendliness": "...",
    "engagement": "...",
    "relevance": "..."
  },
  "suggestions": ["...", "..."],
  "verdict": "PASS"
}
```

Set `verdict` to `"PASS"` only if **every** dimension is ≥ 3; otherwise `"REVISE"`.

> When this rubric is run as a subagent, the orchestrator passes a matching JSON schema so the
> output is validated automatically — keep the keys and types exactly as above.
