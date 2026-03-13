import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FBF9F5',
          100: '#F5F0E8',
          200: '#EDE5D5',
          300: '#E0D4BD',
          400: '#D4C4A5',
          500: '#C8B48D',
          600: '#B89E6F',
          700: '#A08556',
          800: '#7D6843',
          900: '#5A4B30',
        },
        gold: {
          50: '#FFF9EB',
          100: '#FFF0CC',
          200: '#FFE099',
          300: '#FFD166',
          400: '#D4A843',
          500: '#B8922E',
          600: '#997A26',
          700: '#7A611E',
          800: '#5C4916',
          900: '#3D300E',
        },
        olive: {
          50: '#F4F6F0',
          100: '#E5EAD9',
          200: '#CDD6B6',
          300: '#B0BE8E',
          400: '#94A76B',
          500: '#6B7F4A',
          600: '#566639',
          700: '#414D2B',
          800: '#2E361E',
          900: '#1B2012',
        },
        charcoal: {
          50: '#F2F2F3',
          100: '#E0E0E2',
          200: '#C1C1C5',
          300: '#9E9EA4',
          400: '#7B7B83',
          500: '#5C5C64',
          600: '#47474E',
          700: '#34343A',
          800: '#232328',
          900: '#141417',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
