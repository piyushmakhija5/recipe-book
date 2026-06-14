# 5. Image strategy: YouTube thumbnail now, ImageGen MCP later

- **Status:** Accepted (with a planned follow-up)
- **Date:** 2026-06-14

## Context

Every recipe needs a relevant `image`. The brief allows images that are **generated** or
**pulled from the YouTube video**, but they must be relevant to the dish. This environment
has no built-in image generation, and an image-generation MCP server is planned but not yet
wired up.

## Decision

**For now:** use the recipe's YouTube video **thumbnail** as the image:

```
https://img.youtube.com/vi/<VIDEO_ID>/maxresdefault.jpg
```

This is deterministic (derived from the verified video ID), always depicts the actual dish
being made, and needs no extra tooling.

**Later:** once the **ImageGen MCP server** is added, prefer a generated image that matches
the finished dish, and **fall back to the thumbnail** if generation is unavailable or
produces something irrelevant. Adding that server is a project learning goal.

## Consequences

- Zero extra dependencies today; images are always relevant because they come from a video
  of the dish.
- `maxresdefault.jpg` isn't guaranteed for every video; consumers may need to fall back to
  `hqdefault.jpg`. Note this when implementing.
- When the MCP lands, this decision gets a superseding ADR describing the generation flow
  and the fallback.

## Alternatives considered

- **Stock photo search:** risk of irrelevant or mismatched images; rejected.
- **Require generated images now:** not possible without the MCP; would block recipe
  creation.
