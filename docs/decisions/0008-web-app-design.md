# 8. Web app design — stack, aesthetics, and component architecture

- **Status:** Accepted
- **Date:** 2026-06-14

## Context

We needed to render the `recipes/*.md` files as a web application with an Indian homely
aesthetic, lots of visuals, and a beginner-friendly reading experience.

## Decisions

### Stack
- **Next.js App Router** with TypeScript and Tailwind CSS (already decided in ADR 0003).
- **No extra markdown renderer** (`next-mdx-remote` / `remark`) — the recipe body is
  parsed into typed data (`IngredientGroup[]`, `StepGroup[]`, `NoteItem[]`) in
  `src/lib/recipes.ts`, so UI components receive plain strings and render them directly.
  This gives full visual control without an HTML sanitization surface.

### Design system (Indian Homely palette)
```
cream:      #FFFBF0  — warm page background
saffron:    #F5A623  — primary accent
terracotta: #C25B38  — step numbers, hero, CTAs
turmeric:   #D4870C  — sub-headings, prep bars
spice:      #8B2500  — deep red accent
coriander:  #4A7C59  — tags, protein macro
charcoal:   #2C1810  — body text
```
Fonts: `Playfair Display` (display/headings) + `Lato` (body), loaded via `next/font/google`.

### Nutrition chart
`recharts` `PieChart` with `innerRadius` (donut), Indian palette per macro. Requires
`'use client'` — isolated in `NutritionChart.tsx`, wrapped by server-rendered
`NutritionPanel.tsx`.

### Social features (browser localStorage)
Votes (`👍 / 👎`) and comments are personal to the browser — no backend. Schema:
- `rasa:vote:${slug}` → `'up' | 'down' | null`
- `rasa:comments:${slug}` → `{ id, text, timestamp }[]`
A generic `useLocalStorage<T>` hook (in `src/hooks/`) handles SSR-safety and JSON
serialization.

### Static generation
All recipe pages are pre-rendered via `generateStaticParams` → `dynamicParams = false`.
No runtime server needed; the app can be deployed as a static export.

## Consequences
- Zero database or backend infrastructure for the social features; data is per-device.
- If we add multi-user social features later, the `localStorage` schema maps cleanly to a
  REST/GraphQL API — just replace the `useLocalStorage` calls with fetch calls.
- The manual section parser in `lib/recipes.ts` is tightly coupled to the `###` H3 heading
  convention in the recipe files — any format change requires updating the parser.
