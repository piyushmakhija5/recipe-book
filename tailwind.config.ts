import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:      '#FFFBF0',
        saffron:    '#F5A623',
        terracotta: '#C25B38',
        turmeric:   '#D4870C',
        spice:      '#8B2500',
        coriander:  '#4A7C59',
        charcoal:   '#2C1810',
      },
      fontFamily: {
        display: ['var(--font-playfair)', ...fontFamily.serif],
        body:    ['var(--font-lato)',     ...fontFamily.sans],
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #FFFBF0 0%, #FEF3D0 100%)',
      },
    },
  },
  plugins: [],
}

export default config
