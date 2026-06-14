'use client'

import { useLocalStorage } from '@/hooks/useLocalStorage'

type Vote = 'up' | 'down' | null

export default function RecipeReactions({ slug }: { slug: string }) {
  const [vote, setVote] = useLocalStorage<Vote>(`rasa:vote:${slug}`, null)

  const handleVote = (v: 'up' | 'down') => {
    setVote(vote === v ? null : v)
  }

  return (
    <div className="mt-10 py-6 border-t border-saffron/20">
      <p className="text-center text-charcoal/60 text-sm mb-4 font-body">Was this recipe helpful?</p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handleVote('up')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-200 ${
            vote === 'up'
              ? 'bg-saffron border-saffron text-white shadow-md scale-105'
              : 'border-saffron/40 text-charcoal/60 hover:border-saffron hover:text-saffron'
          }`}
        >
          👍 Liked it
        </button>
        <button
          onClick={() => handleVote('down')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-200 ${
            vote === 'down'
              ? 'bg-terracotta border-terracotta text-white shadow-md scale-105'
              : 'border-saffron/40 text-charcoal/60 hover:border-terracotta hover:text-terracotta'
          }`}
        >
          👎 Not for me
        </button>
      </div>
      {vote && (
        <p className="text-center text-xs text-charcoal/40 mt-3">
          {vote === 'up' ? 'Glad you liked it! 🌿' : 'Thanks for the feedback!'}
        </p>
      )}
    </div>
  )
}
