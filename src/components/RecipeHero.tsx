import Image from 'next/image'

interface RecipeHeroProps {
  title: string
  image: string
  cuisine: string
}

export default function RecipeHero({ title, image, cuisine }: RecipeHeroProps) {
  return (
    <div className="relative w-full h-[50vh] min-h-[320px] overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />

      {/* Title block — bottom left */}
      <div className="absolute bottom-0 left-0 p-8 max-w-3xl">
        <p className="text-saffron text-sm font-body uppercase tracking-widest mb-2">
          {cuisine}
        </p>
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream leading-tight">
          {title}
        </h1>
      </div>
    </div>
  )
}
