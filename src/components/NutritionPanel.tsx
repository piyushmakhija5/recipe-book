import type { RecipeNutrition } from '@/lib/types'
import NutritionChart from './NutritionChart'

const MACRO_LABELS: Record<string, string> = {
  protein: 'Protein',
  carbs:   'Carbs',
  fat:     'Fat',
  fibre:   'Fibre',
}

export default function NutritionPanel({ nutrition }: { nutrition: RecipeNutrition }) {
  const macroKeys = ['protein', 'carbs', 'fat', 'fibre'].filter((k) => nutrition[k] != null)

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-saffron/15">
      <h3 className="font-display text-base text-charcoal mb-1">Nutrition</h3>
      <p className="text-xs text-charcoal/50 mb-3">per serving</p>

      {/* Calorie callout */}
      <div className="text-center mb-4">
        <span className="font-display text-4xl text-terracotta">{nutrition.calories}</span>
        <span className="text-charcoal/50 text-sm ml-1">kcal</span>
      </div>

      {/* Donut chart — client component */}
      <NutritionChart nutrition={nutrition} />

      {/* Macro grid */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
        {macroKeys.map((k) => (
          <div key={k} className="flex justify-between">
            <span className="text-charcoal/60">{MACRO_LABELS[k] ?? k}</span>
            <span className="font-semibold text-charcoal">{nutrition[k]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
