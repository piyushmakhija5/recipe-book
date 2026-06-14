import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Recipe Book', template: '%s | Recipe Book' },
  description: 'A collection of home-cooked North Indian recipes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="font-body bg-cream text-charcoal min-h-screen flex flex-col">
        <header className="bg-terracotta px-6 py-4 flex items-center justify-between shadow-md">
          <Link href="/" className="font-display text-cream text-2xl tracking-wide hover:text-saffron transition-colors">
            रसा · Rasa
          </Link>
          <p className="text-cream/70 text-sm hidden sm:block">Home-cooked Indian Food</p>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-charcoal text-cream/60 text-center py-6 text-sm">
          Made with love and spices 🌿
        </footer>
      </body>
    </html>
  )
}
