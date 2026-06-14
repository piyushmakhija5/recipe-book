import Link from 'next/link'
import Image from 'next/image'
import type { Recipe } from '@/lib/types'
import { getMealLabel } from '@/lib/recipes'

const MEAL_COLORS: Record<string, string> = {
  Breakfast: 'bg-turmeric/20 text-turmeric border-turmeric/40',
  Lunch:     'bg-coriander/20 text-coriander border-coriander/40',
  Dinner:    'bg-terracotta/15 text-terracotta border-terracotta/40',
  Recipe:    'bg-saffron/20 text-saffron border-saffron/40',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy:   'text-coriander',
  Medium: 'text-turmeric',
  Hard:   'text-spice',
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { frontmatter: f, slug } = recipe
  const mealLabel  = getMealLabel(f.tags)
  const mealColor  = MEAL_COLORS[mealLabel]
  const diffColor  = f.difficulty ? DIFFICULTY_COLORS[f.difficulty] : 'text-charcoal/50'
  const displayTags = (f.tags ?? []).slice(0, 3)

  return (
    <Link href={`/recipes/${slug}`} className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-saffron/20">
      {/* Hero image */}
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={f.image}
          alt={f.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Meal badge overlay */}
        <span className={`absolute top-3 left-3 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-sm bg-white/80 ${mealColor}`}>
          {mealLabel}
        </span>
      </div>

      {/* Card body */}
      <div className="p-5">
        <h2 className="font-display text-lg text-charcoal leading-snug mb-1 group-hover:text-terracotta transition-colors">
          {f.title}
        </h2>

        <div className="flex items-center gap-3 text-sm text-charcoal/60 mb-3">
          <span>{f.cuisine}</span>
          {f.difficulty && (
            <>
              <span className="text-saffron/40">·</span>
              <span className={diffColor}>{f.difficulty}</span>
            </>
          )}
          <span className="text-saffron/40">·</span>
          <span className="text-turmeric font-semibold">{f.time.total}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {displayTags.map((tag) => (
            <span key={tag} className="bg-saffron/10 text-saffron text-xs rounded-full px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        {/* Short note */}
        {f.notes && (
          <p className="text-charcoal/60 text-sm italic leading-relaxed line-clamp-2">{f.notes}</p>
        )}

        <div className="mt-4 text-terracotta text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
          View Recipe →
        </div>
      </div>
    </Link>
  )
}
