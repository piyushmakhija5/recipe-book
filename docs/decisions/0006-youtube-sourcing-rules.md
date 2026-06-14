# 6. YouTube sourcing: never invent, always fetch and verify

- **Status:** Accepted
- **Date:** 2026-06-14

## Context

Every recipe carries a `youtube` link, and the `image` is derived from that video. A
plausible-looking but fake YouTube URL is worse than no URL: it breaks the image, misleads
the reader, and (for a learning project about trustworthy AI output) trains the wrong habit.
Models can easily hallucinate URLs that look real.

## Decision

The `recipe-format` skill must **never fabricate a YouTube URL or video ID.** It must:

1. **Find** a real video — by searching YouTube (for a dish-name input) or using the link
   the user provided (for a link input).
2. **Verify** the video actually resolves before using it (fetch the watch page / confirm
   the ID is real).
3. **Derive** the image thumbnail from that same verified video ID.
4. If no suitable, verifiable video is found, **do not write the file with a guessed URL** —
   report that no good video was found and stop.

## Consequences

- The skill depends on web search/fetch tooling to locate and confirm videos.
- Recipe creation can fail (by design) when no real video exists — that's preferred over a
  fabricated link.
- Both `youtube` and `image` are guaranteed to point at the same real video.
