import type { NoteItem } from '@/lib/types'

export default function NotesList({ notes }: { notes: NoteItem[] }) {
  if (!notes.length) return null
  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-charcoal mb-4">Cook&apos;s Notes</h2>
      <div className="space-y-3">
        {notes.map((note, i) => (
          <div
            key={i}
            className="border-l-4 border-saffron rounded-r-xl px-5 py-4"
            style={{ backgroundColor: 'rgb(245 166 35 / 0.07)' }}
          >
            {note.label && (
              <strong className="font-display text-terracotta">{note.label}: </strong>
            )}
            <span className="text-charcoal/80 leading-relaxed">{note.body}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
