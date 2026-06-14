'use client'

import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface Comment {
  id: string
  text: string
  timestamp: number
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  < 1)  return 'just now'
  if (mins  < 60) return `${mins} min ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${days} day${days > 1 ? 's' : ''} ago`
}

export default function RecipeComments({ slug }: { slug: string }) {
  const [comments, setComments] = useLocalStorage<Comment[]>(`rasa:comments:${slug}`, [])
  const [draft, setDraft] = useState('')

  const post = () => {
    const text = draft.trim()
    if (!text) return
    const newComment: Comment = {
      id: crypto.randomUUID(),
      text,
      timestamp: Date.now(),
    }
    setComments([newComment, ...comments])
    setDraft('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) post()
  }

  return (
    <div className="mt-8 py-8 border-t border-saffron/20">
      <h2 className="font-display text-2xl text-charcoal mb-5">Your Notes &amp; Comments</h2>

      {/* Composer */}
      <div className="mb-6">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          rows={3}
          placeholder="Leave a note, a tip, or how it turned out… (Cmd+Enter to post)"
          className="w-full rounded-xl border border-saffron/30 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:ring-2 focus:ring-saffron/40 resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={post}
            disabled={!draft.trim()}
            className="px-5 py-2 rounded-full bg-terracotta text-cream text-sm font-semibold disabled:opacity-40 hover:bg-spice transition-colors"
          >
            Post
          </button>
        </div>
      </div>

      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="text-charcoal/40 italic text-sm text-center py-4">
          No notes yet — be the first to leave one!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="bg-white rounded-xl px-5 py-4 border border-saffron/15 shadow-sm">
              <p className="text-charcoal/80 text-sm leading-relaxed">{c.text}</p>
              <p className="text-charcoal/35 text-xs mt-2">{formatRelative(c.timestamp)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
