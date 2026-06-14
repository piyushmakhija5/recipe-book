import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type {
  Recipe,
  RecipeFrontmatter,
  IngredientGroup,
  IngredientItem,
  StepGroup,
  NoteItem,
} from './types'

const RECIPES_DIR = path.join(process.cwd(), 'recipes')

// ── helpers ──────────────────────────────────────────────────────────────────

/** Extract the number of grams from an ingredient string, e.g. "(200 g)" → 200 */
function parseGrams(text: string): number | undefined {
  const m = text.match(/\((\d[\d.]*)\s*g\b/)
  return m ? parseInt(m[1], 10) : undefined
}

/** Extract total minutes from time strings like "15 min (+ 4 hr soaking)" or "1 hr 10 min" */
export function parseMinutes(s: string): number {
  const hrMatch  = s.match(/(\d+)\s*hr/)
  const minMatch = s.match(/(\d+)\s*min/)
  const hrs  = hrMatch  ? parseInt(hrMatch[1],  10) : 0
  const mins = minMatch ? parseInt(minMatch[1], 10) : 0
  return hrs * 60 + mins
}

/** Extract the text of a named `## Heading` section from the body */
function extractSection(body: string, heading: string): string {
  const re = new RegExp(`^##\\s+${heading}\\s*$([\\s\\S]*?)(?=^##\\s|$)`, 'im')
  const m  = body.match(re)
  return m ? m[1].trim() : ''
}

// ── section parsers ───────────────────────────────────────────────────────────

function parseIngredients(body: string): IngredientGroup[] {
  const section = extractSection(body, 'Ingredients')
  const groups: IngredientGroup[] = []
  let current: IngredientGroup = { heading: null, items: [] }

  for (const raw of section.split('\n')) {
    const line = raw.trim()
    const h3 = line.match(/^###\s+(.+)$/)
    if (h3) {
      if (current.items.length > 0) groups.push(current)
      current = { heading: h3[1].trim(), items: [] }
      continue
    }
    const bullet = line.match(/^-\s+(.+)$/)
    if (bullet) {
      const text = bullet[1].trim()
      const item: IngredientItem = { text, grams: parseGrams(text) }
      current.items.push(item)
    }
  }
  if (current.items.length > 0) groups.push(current)
  return groups
}

function parseSteps(body: string): StepGroup[] {
  const section = extractSection(body, 'Steps')
  const groups: StepGroup[] = []
  let current: StepGroup = { heading: null, steps: [] }

  for (const raw of section.split('\n')) {
    const line = raw.trim()
    const h3 = line.match(/^###\s+(.+)$/)
    if (h3) {
      if (current.steps.length > 0) groups.push(current)
      current = { heading: h3[1].trim(), steps: [] }
      continue
    }
    const step = line.match(/^(\d+)\.\s+(.+)$/)
    if (step) {
      current.steps.push({ number: parseInt(step[1], 10), text: step[2].trim() })
    }
  }
  if (current.steps.length > 0) groups.push(current)
  return groups
}

function parseNotes(body: string): NoteItem[] {
  const section = extractSection(body, 'Notes')
  const items: NoteItem[] = []

  for (const raw of section.split('\n')) {
    const bullet = raw.trim().match(/^-\s+(.+)$/)
    if (!bullet) continue
    const text = bullet[1].trim()
    // Split "**Bold label.** rest of text" into label + body
    const bold = text.match(/^\*\*(.+?)\*\*\s*(.*)$/)
    if (bold) {
      items.push({ label: bold[1].replace(/[.:]\s*$/, '').trim(), body: bold[2].trim() })
    } else {
      items.push({ label: null, body: text })
    }
  }
  return items
}

// ── public API ────────────────────────────────────────────────────────────────

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(RECIPES_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

export function getRecipeBySlug(slug: string): Recipe {
  const filePath     = path.join(RECIPES_DIR, `${slug}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    frontmatter: data as RecipeFrontmatter,
    ingredients: parseIngredients(content),
    stepGroups:  parseSteps(content),
    notes:       parseNotes(content),
  }
}

export function getAllRecipes(): Recipe[] {
  return getAllSlugs()
    .map((slug) => getRecipeBySlug(slug))
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
}

/** Derive a meal label from tags for index-page badges */
export function getMealLabel(tags: string[] = []): string {
  const t = tags.map((s) => s.toLowerCase())
  if (t.some((x) => x.includes('breakfast'))) return 'Breakfast'
  if (t.some((x) => x.includes('lunch') || x.includes('office'))) return 'Lunch'
  if (t.some((x) => x.includes('dinner'))) return 'Dinner'
  return 'Recipe'
}

/** Extract YouTube video ID from a watch URL */
export function videoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.searchParams.get('v')) return u.searchParams.get('v')
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1) || null
  } catch {
    return null
  }
  return null
}
