import { getAllRecipes } from '@/lib/recipes'
import RecipeCard from '@/components/RecipeCard'

export default function HomePage() {
  const recipes = getAllRecipes()

  return (
    <>
      {/* Hero banner */}
      <section className="bg-warm-gradient py-16 px-6 text-center">
        <p className="text-saffron text-sm uppercase tracking-[0.2em] mb-3 font-body">
          A little book of
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-4 leading-tight">
          Home-cooked Indian Recipes
        </h1>
        <p className="text-charcoal/60 max-w-md mx-auto text-base">
          Simple, nourishing, and made with love — one recipe at a time.
        </p>
        {/* Decorative divider */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-terracotta/30" />
          <span className="text-terracotta text-xl">✦</span>
          <div className="h-px w-16 bg-terracotta/30" />
        </div>
      </section>

      {/* Recipe grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="font-display text-2xl text-charcoal mb-8 text-center">Today&apos;s Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      </section>
    </>
  )
}
