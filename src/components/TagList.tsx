export default function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null
  return (
    <div className="flex flex-wrap gap-2 mt-5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="bg-coriander/10 text-coriander border border-coriander/30 text-xs font-semibold uppercase tracking-wide rounded-full px-3 py-1"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
