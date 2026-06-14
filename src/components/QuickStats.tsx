import type { RecipeTime } from '@/lib/types'

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy:   'text-coriander',
  Medium: 'text-turmeric',
  Hard:   'text-spice',
}

interface QuickStatsProps {
  time: RecipeTime
  servings: number
  cuisine: string
  difficulty?: string
}

function Stat({ label, value, valueClass = '' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-3 text-center bg-cream">
      <p className="text-xs text-charcoal/50 uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`font-display text-lg font-semibold ${valueClass || 'text-charcoal'}`}>{value}</p>
    </div>
  )
}

export default function QuickStats({ time, servings, cuisine, difficulty }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 rounded-xl overflow-hidden border border-saffron/20 shadow-sm mt-6 divide-x divide-y md:divide-y-0 divide-saffron/20">
      <Stat label="Total Time" value={time.total} valueClass="text-terracotta" />
      <Stat label="Servings"   value={`${servings} people`} />
      <Stat label="Cuisine"    value={cuisine} />
      <Stat
        label="Difficulty"
        value={difficulty ?? '—'}
        valueClass={difficulty ? DIFFICULTY_STYLES[difficulty] : 'text-charcoal/40'}
      />
    </div>
  )
}
