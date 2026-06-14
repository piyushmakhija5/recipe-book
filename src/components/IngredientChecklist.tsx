'use client'

import { useState } from 'react'
import type { IngredientGroup } from '@/lib/types'

export default function IngredientChecklist({ groups }: { groups: IngredientGroup[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) { next.delete(key) } else { next.add(key) }
      return next
    })
  }

  const totalItems = groups.reduce((s, g) => s + g.items.length, 0)
  const checkedCount = checked.size

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl text-charcoal">Ingredients</h2>
        {checkedCount > 0 && (
          <span className="text-xs text-coriander bg-coriander/10 px-2 py-1 rounded-full">
            {checkedCount}/{totalItems} ready
          </span>
        )}
      </div>
      <p className="text-xs text-charcoal/40 mb-4 italic">Check off as you gather them</p>

      {groups.map((group, gi) => (
        <div key={gi} className="mb-5">
          {group.heading && (
            <h3 className="font-display text-sm text-terracotta uppercase tracking-wide border-b border-saffron/25 pb-1 mb-3">
              {group.heading}
            </h3>
          )}
          <ul className="space-y-1">
            {group.items.map((item, ii) => {
              const key = `${gi}-${ii}`
              const isChecked = checked.has(key)
              return (
                <li key={key}>
                  <label className="flex items-start gap-3 py-1.5 px-2 -mx-2 rounded-lg cursor-pointer hover:bg-saffron/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(key)}
                      className="mt-0.5 h-4 w-4 rounded accent-terracotta flex-shrink-0"
                    />
                    <span className={`text-sm leading-relaxed transition-colors ${isChecked ? 'line-through text-charcoal/35' : 'text-charcoal/80'}`}>
                      {item.text}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
