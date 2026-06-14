# Recipe Format Spec

The canonical structure for a recipe file. Both the Next.js app and the `recipe-format`
skill treat this as the source of truth. If this changes, update the app's frontmatter
parsing/validation and the skill together.

## File & naming

- **One recipe per file**, stored at `recipes/<slug>.md`.
- `<slug>` is the kebab-cased title, e.g. `Weeknight Chicken Biryani` →
  `weeknight-chicken-biryani.md`. The slug is the page route: `/recipes/<slug>`.
- The file has two parts: **YAML frontmatter** (metadata) and a **Markdown body**
  (ingredients + steps).

## Frontmatter fields

| Field        | Required | Type            | Notes |
|--------------|----------|-----------------|-------|
| `title`      | ✅        | string          | Enticing, evocative — not just the dish name. e.g. "Weeknight Chicken Biryani" not "Chicken Rice". |
| `cuisine`    | ✅        | string          | e.g. "Indian", "Italian", "Thai". |
| `servings`   | ✅        | number          | Number of servings the quantities yield. |
| `time`       | ✅        | object          | `prep`, `cook`, `total` as human strings (e.g. "20 min", "1 hr"). `total` is required; `prep`/`cook` recommended. |
| `image`      | ✅        | URL string      | A relevant image. For now, the YouTube thumbnail: `https://img.youtube.com/vi/<VIDEO_ID>/maxresdefault.jpg`. Later, a generated image from the ImageGen MCP. |
| `youtube`    | ✅        | URL string      | A **real, verified** video URL: `https://www.youtube.com/watch?v=<VIDEO_ID>`. Never fabricated. See [decisions/0006](./decisions/0006-youtube-sourcing-rules.md). |
| `tags`       | ❌        | string[]        | e.g. `["one-pot", "spicy", "rice"]`. |
| `difficulty` | ❌        | enum            | `Easy` \| `Medium` \| `Hard`. |
| `nutrition`  | ❌        | object          | Per serving. Suggested keys: `calories` (number), `protein`, `carbs`, `fat` (strings with units). Add more macros as useful. |
| `notes`      | ❌        | string          | Short note; longer notes go in the body `## Notes` section instead. |

> The required set maps directly to the brief: enticing **title**, **cuisine**,
> **servings**, **time**, **image**, **YouTube link** (frontmatter) + **numbered steps**
> and **ingredients** (body). Optional: **tags**, **difficulty**, **nutrition/macros**,
> **notes**.

## Body structure

The body uses these sections, in this order. Ingredients and Steps are required; Notes is
optional.

```markdown
## Ingredients
- <quantity + ingredient>   (one per line, bulleted)

## Steps
1. <step>                   (numbered, imperative, one action-ish per step)
2. <step>

## Notes                    (optional)
- <tip, substitution, make-ahead, etc.>
```

## Field rules & guidance

- **Image relevance matters.** The image must depict this dish. The YouTube thumbnail is
  acceptable because it comes from a video of the dish being made; a generic stock photo is
  not. When the ImageGen MCP is available, generate an image that matches the finished dish.
- **Steps are numbered and actionable.** Prefer a clear sequence over one giant paragraph.
- **Ingredients include quantities** scaled to `servings`.
- **YouTube link is verified, never invented** — if no good video is found, do not write the
  file with a guessed URL; report that instead.

## Worked example

`recipes/weeknight-chicken-biryani.md` (the `<VIDEO_ID>` placeholders would be a real,
verified ID in an actual recipe):

```markdown
---
title: "Weeknight Chicken Biryani"
cuisine: "Indian"
servings: 4
time:
  prep: "25 min"
  cook: "45 min"
  total: "1 hr 10 min"
image: "https://img.youtube.com/vi/<VIDEO_ID>/maxresdefault.jpg"
youtube: "https://www.youtube.com/watch?v=<VIDEO_ID>"
tags: ["rice", "one-pot", "spicy"]
difficulty: "Medium"
nutrition:
  calories: 620
  protein: "34 g"
  carbs: "78 g"
  fat: "18 g"
---

## Ingredients
- 500 g bone-in chicken thighs
- 2 cups basmati rice, soaked 30 min
- 2 large onions, thinly sliced
- 1 cup plain yogurt
- 3 tbsp biryani masala
- ...

## Steps
1. Marinate the chicken in yogurt and half the biryani masala for at least 20 minutes.
2. Fry the sliced onions until deep golden; set half aside for garnish.
3. Parboil the soaked rice with whole spices until 70% cooked, then drain.
4. Layer chicken, fried onions, and rice; finish with saffron milk.
5. Cover and cook on low (dum) for 25 minutes, then rest 10 minutes before serving.

## Notes
- Swap chicken for paneer or vegetables to make it vegetarian.
- A tight lid (or dough seal) keeps the steam in during the dum stage.
```
