---
name: recipe-format
description: >-
  Create a structured recipe file (one Markdown page per recipe) from a dish
  name/idea or a YouTube cooking-video link. Use this whenever the user wants to
  add, create, write, or format a recipe for the recipe book — e.g. "make me a
  recipe for chicken biryani", "add this to the recipe book", or pasting a
  YouTube cooking link — even if they don't say "recipe-format". It finds and
  verifies a REAL YouTube video (never invents URLs), derives a relevant image
  from that video, and writes recipes/<slug>.md with every required field.
---

# recipe-format

Turn a **dish idea** or a **YouTube video link** into a single, spec-compliant recipe file
at `recipes/<slug>.md`. This is the content pipeline for the recipe book: the file you
produce here is exactly what the Next.js app renders as one page per recipe.

## The format is defined elsewhere — read it

The canonical schema (frontmatter fields, body structure, field rules, and a worked
example) lives in **`docs/recipe-format-spec.md`** at the repo root. That file is the
contract shared by this skill and the web app. **Read it before writing a recipe**, and if
anything here seems to disagree with it, the spec wins.

Quick reference so you know what you're aiming for:

- **Frontmatter (required):** `title` (enticing), `cuisine`, `servings`, `time`
  (`{prep, cook, total}`), `image`, `youtube`.
- **Frontmatter (optional):** `tags`, `difficulty` (Easy|Medium|Hard), `nutrition` (per
  serving), `notes`.
- **Body (required):** `## Ingredients` (bulleted, with quantities) and `## Steps`
  (numbered). `## Notes` is optional.
- **File:** one recipe per file, `recipes/<slug>.md`, where `<slug>` is the kebab-cased
  title.

## Hard rules (these are the point of the skill)

1. **Never invent a YouTube URL or video ID.** A fabricated link breaks the image, misleads
   the reader, and defeats the purpose. Always find a real video and **verify it resolves**
   before using it. If you can't find a suitable, verifiable video, **do not write the file
   with a guessed link** — tell the user no good video was found and stop.
2. **The image must be relevant.** For now, derive it from the verified video's thumbnail
   (see below) — it always depicts the actual dish. (Later, an ImageGen MCP server may
   generate one; until it exists, use the thumbnail.)
3. **One recipe per file.** Don't append multiple recipes to a file or cram variations in.

## Workflow

### 1. Identify the input

- **A YouTube link** → use that specific video; the recipe should reflect what it makes.
- **A dish name / idea** (e.g. "chicken biryani") → search YouTube for a real, relevant
  cooking video first (step 2), then build the recipe around it.

### 2. Get a verified video

**If given a link:** extract the video ID (the `v=` query param, or the path segment for
`youtu.be/<id>`), then verify it (below).

**If given a dish idea:** find a real video.
- Use web search for something like `<dish> recipe youtube`, and prefer results from
  reputable cooking channels with a clear, followable method.
- Collect the candidate's video ID from its `watch?v=<id>` URL.

**Verify the video actually exists** using YouTube's keyless oEmbed endpoint — it returns
HTTP 200 with JSON (`title`, `author_name`) for a real video and an error for a fake one:

```
https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<VIDEO_ID>&format=json
```

Fetch that URL. If it doesn't resolve to valid JSON, the video is not real — pick another
candidate or stop. Keep the returned title/author; they help confirm the video matches the
dish.

### 3. Gather the recipe content

- For a **link**, base the ingredients and steps on that video (its title, description, and
  any visible recipe details). The recipe should be faithful to what the video makes.
- For a **dish idea**, write a correct, standard version of the dish that is consistent with
  the chosen video. Don't contradict the video you linked.
- Quantities scale to `servings`. Steps are numbered, imperative, and one logical action-ish
  per step — not one giant paragraph.

### 4. Assemble the fields

- `title` — make it **enticing**, not just the dish name ("Weeknight Chicken Biryani", not
  "Chicken Rice").
- `cuisine`, `servings`, `time.{prep,cook,total}` — fill all; `total` is required.
- `youtube` — the **verified** `https://www.youtube.com/watch?v=<VIDEO_ID>` URL.
- `image` — the thumbnail for that same video ID:
  `https://img.youtube.com/vi/<VIDEO_ID>/maxresdefault.jpg`. `maxresdefault.jpg` isn't
  present for every video; if you have reason to believe it's missing, fall back to
  `https://img.youtube.com/vi/<VIDEO_ID>/hqdefault.jpg`.
- Optional fields (`tags`, `difficulty`, `nutrition`, `notes`) — add them when you can do so
  sensibly. `nutrition` is **per serving** and is an estimate; keep it reasonable.

### 5. Write the file

- Compute `<slug>` = kebab-cased `title` (lowercase, spaces → `-`, drop punctuation).
- Write to `recipes/<slug>.md`, matching the structure in `docs/recipe-format-spec.md`
  exactly (frontmatter then `## Ingredients`, `## Steps`, optional `## Notes`).
- If `recipes/` doesn't exist yet, create it.

### 6. Self-check before finishing

Confirm all of the following; if any fails, fix it before reporting done:

- [ ] All **required** frontmatter present: `title`, `cuisine`, `servings`, `time.total`,
      `image`, `youtube`.
- [ ] `youtube` was **verified** to resolve (you actually fetched oEmbed and it returned
      valid JSON) — not guessed.
- [ ] `image` URL uses the **same** video ID as `youtube`.
- [ ] Body has a non-empty `## Ingredients` (with quantities) and numbered `## Steps`.
- [ ] Exactly one recipe in the file; filename is `recipes/<kebab-title>.md`.

Then tell the user the file path you wrote and the video (title + URL) you used, so they can
sanity-check the source.

## When no good video exists

Stop and say so. Offer to broaden the search or let the user supply a link. Do **not** write
a recipe with a placeholder or invented URL — a missing recipe is better than a fake source.

## Examples

**Example 1 — dish idea**
Input: "add a chicken biryani recipe to the book"
→ Search YouTube for a strong biryani video, verify it via oEmbed, write
`recipes/weeknight-chicken-biryani.md` with the verified link + its thumbnail and all
required fields.

**Example 2 — YouTube link**
Input: "make a recipe from https://www.youtube.com/watch?v=ABC123 — it's a pad thai"
→ Verify `ABC123` resolves, base ingredients/steps on that video, write
`recipes/<slug>.md` using that exact link and `img.youtube.com/vi/ABC123/maxresdefault.jpg`.

**Example 3 — no video found**
Input: "recipe for my grandma's secret stew" (nothing matching on YouTube)
→ Report that no verifiable video was found; ask whether to broaden the search or get a
link. Don't write a file with a fabricated URL.
