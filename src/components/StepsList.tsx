import type { StepGroup } from '@/lib/types'
import React from 'react'

function renderBoldText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="text-terracotta font-semibold">{part.slice(2, -2)}</strong>
      : part
  )
}

export default function StepsList({ stepGroups }: { stepGroups: StepGroup[] }) {
  return (
    <div className="mt-8">
      <h2 className="font-display text-2xl text-charcoal mb-6">Method</h2>
      {stepGroups.map((group, gi) => (
        <div key={gi}>
          {group.heading && (
            <h3 className="font-display text-lg text-turmeric mt-8 mb-4 pb-1 border-b border-turmeric/20">
              {group.heading}
            </h3>
          )}
          <div className="space-y-5">
            {group.steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                {/* Step number badge */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-terracotta text-cream text-sm font-bold flex items-center justify-center shadow-sm">
                  {step.number}
                </div>
                {/* Step text */}
                <p className="text-charcoal leading-relaxed pt-1.5 flex-1">
                  {renderBoldText(step.text)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
