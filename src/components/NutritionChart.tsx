'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { RecipeNutrition } from '@/lib/types'

const MACRO_CONFIG = [
  { key: 'protein', label: 'Protein', color: '#4A7C59' },
  { key: 'carbs',   label: 'Carbs',   color: '#F5A623' },
  { key: 'fat',     label: 'Fat',     color: '#C25B38' },
  { key: 'fibre',   label: 'Fibre',   color: '#D4870C' },
]

function parseGrams(s: string | number | undefined): number {
  if (s == null) return 0
  if (typeof s === 'number') return s
  const m = s.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

export default function NutritionChart({ nutrition }: { nutrition: RecipeNutrition }) {
  const data = MACRO_CONFIG
    .filter((m) => nutrition[m.key] != null)
    .map((m) => ({ name: m.label, value: parseGrams(nutrition[m.key]), color: m.color }))
    .filter((d) => d.value > 0)

  if (!data.length) return null

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [`${value} g`, name]}
          contentStyle={{ borderRadius: '8px', border: '1px solid #F5A623', fontSize: '12px' }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
