import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DB954',
        dark: '#0F0F0F',
        'dark-light': '#181818',
      },
    },
  },
  plugins: [],
}
export default config