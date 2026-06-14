export interface RecipeTime {
  prep?: string
  cook?: string
  total: string
}

export interface RecipeNutrition {
  calories: number
  protein?: string
  carbs?: string
  fat?: string
  fibre?: string
  [key: string]: string | number | undefined
}

export interface RecipeFrontmatter {
  title: string
  cuisine: string
  servings: number
  time: RecipeTime
  image: string
  youtube: string
  tags?: string[]
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  nutrition?: RecipeNutrition
  notes?: string
}

export interface IngredientItem {
  text: string
  grams?: number
}

export interface IngredientGroup {
  heading: string | null
  items: IngredientItem[]
}

export interface StepGroup {
  heading: string | null
  steps: { number: number; text: string }[]
}

export interface NoteItem {
  label: string | null
  body: string
}

export interface Recipe {
  slug: string
  frontmatter: RecipeFrontmatter
  ingredients: IngredientGroup[]
  stepGroups: StepGroup[]
  notes: NoteItem[]
}
