/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Optik Text"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        shield: ['"ShieldFont Mentat"', '"Optik Text"', 'sans-serif'],
      },
      colors: {
        'navy': '#0f172a',
        'muted': '#94a3b8',
        'brand': '#1e3a8a',
        'card': '#0f172a',
        'accent-theatre': '#c2410c', /* warm amber/crimson for theatre */
      }
    },
  },
  plugins: [],
}

