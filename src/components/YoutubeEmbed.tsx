import { videoId } from '@/lib/recipes'

interface YoutubeEmbedProps {
  url: string
  title: string
}

export default function YoutubeEmbed({ url, title }: YoutubeEmbedProps) {
  const vid = videoId(url)
  if (!vid) return null
  const embedUrl = `https://www.youtube.com/embed/${vid}`

  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl text-charcoal mb-4">Watch &amp; Cook Along</h2>
      <div className="relative w-full rounded-xl overflow-hidden shadow-md" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
