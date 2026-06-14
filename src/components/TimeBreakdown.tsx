import type { RecipeTime } from '@/lib/types'
import { parseMinutes } from '@/lib/recipes'

interface BarProps {
  label: string
  rawValue: string
  minutes: number
  maxMinutes: number
  color: string
}

function Bar({ label, rawValue, minutes, maxMinutes, color }: BarProps) {
  const pct = maxMinutes > 0 ? Math.round((minutes / maxMinutes) * 100) : 0
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-charcoal/70 font-semibold">{label}</span>
        <span className="text-charcoal/50">{rawValue}</span>
      </div>
      <div className="w-full bg-saffron/15 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.max(pct, 4)}%` }}
        />
      </div>
    </div>
  )
}

export default function TimeBreakdown({ time }: { time: RecipeTime }) {
  const prepMins  = time.prep ? parseMinutes(time.prep)  : 0
  const cookMins  = time.cook ? parseMinutes(time.cook)  : 0
  const totalMins = parseMinutes(time.total)
  const maxMins   = Math.max(totalMins, prepMins + cookMins, 1)

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-saffron/15 mb-4">
      <h3 className="font-display text-base text-charcoal mb-4">Time Breakdown</h3>
      {time.prep && (
        <Bar label="Prep"  rawValue={time.prep}  minutes={prepMins}  maxMinutes={maxMins} color="bg-saffron" />
      )}
      {time.cook && (
        <Bar label="Cook"  rawValue={time.cook}  minutes={cookMins}  maxMinutes={maxMins} color="bg-terracotta" />
      )}
      <Bar label="Total" rawValue={time.total} minutes={totalMins} maxMinutes={maxMins} color="bg-charcoal/40" />
    </div>
  )
}
