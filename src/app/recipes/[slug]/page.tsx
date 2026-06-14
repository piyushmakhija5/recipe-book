import type { Metadata } from 'next'
import { getAllSlugs, getRecipeBySlug } from '@/lib/recipes'
import RecipeHero           from '@/components/RecipeHero'
import QuickStats           from '@/components/QuickStats'
import TagList              from '@/components/TagList'
import TimeBreakdown        from '@/components/TimeBreakdown'
import NutritionPanel       from '@/components/NutritionPanel'
import IngredientChecklist  from '@/components/IngredientChecklist'
import StepsList            from '@/components/StepsList'
import NotesList            from '@/components/NotesList'
import YoutubeEmbed         from '@/components/YoutubeEmbed'
import RecipeReactions      from '@/components/RecipeReactions'
import RecipeComments       from '@/components/RecipeComments'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const recipe = getRecipeBySlug(slug)
  const f = recipe.frontmatter
  return {
    title: f.title,
    description: `${f.cuisine} recipe · ${f.time.total}`,
    openGraph: { images: [f.image] },
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const recipe = getRecipeBySlug(slug)
  const { frontmatter: f, ingredients, stepGroups, notes } = recipe

  return (
    <>
      <RecipeHero title={f.title} image={f.image} cuisine={f.cuisine} />

      <div className="max-w-4xl mx-auto px-6 pb-16">
        <TagList tags={f.tags ?? []} />
        <QuickStats
          time={f.time}
          servings={f.servings}
          cuisine={f.cuisine}
          difficulty={f.difficulty}
        />

        {/* Two-column: sidebar + main */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <TimeBreakdown time={f.time} />
            {f.nutrition && <NutritionPanel nutrition={f.nutrition} />}
          </aside>

          {/* Main content */}
          <div className="lg:col-span-2">
            <IngredientChecklist groups={ingredients} />
            <StepsList stepGroups={stepGroups} />
          </div>
        </div>

        {/* Full-width sections below the grid */}
        <NotesList notes={notes} />
        <YoutubeEmbed url={f.youtube} title={f.title} />
        <RecipeReactions slug={slug} />
        <RecipeComments  slug={slug} />
      </div>
    </>
  )
}
