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
          50: '#FAFBF9',
          100: '#F2F4F0',
          200: '#E8ECE4',
          300: '#D8DED2',
          400: '#C4CCBC',
          500: '#A8B49C',
          600: '#8C9A7E',
          700: '#6E7A62',
          800: '#525C49',
          900: '#363D30',
        },
        gold: {
          50: '#FDF8EC',
          100: '#FAF0D4',
          200: '#F5E0A8',
          300: '#EFCE78',
          400: '#D4A843',
          500: '#C09533',
          600: '#A17B28',
          700: '#7D5F1F',
          800: '#5C4616',
          900: '#3B2D0E',
        },
        olive: {
          50: '#F0FAFB',
          100: '#D6F1F3',
          200: '#ADE3E7',
          300: '#7ACFD5',
          400: '#4CB8BF',
          500: '#2E9EA6',
          600: '#258389',
          700: '#1E6A6F',
          800: '#1A5357',
          900: '#133B3E',
        },
        charcoal: {
          50: '#F4F5F5',
          100: '#E2E4E5',
          200: '#C5CACC',
          300: '#A3AAAD',
          400: '#7D868A',
          500: '#5E676B',
          600: '#495054',
          700: '#363B3E',
          800: '#24282A',
          900: '#141617',
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
