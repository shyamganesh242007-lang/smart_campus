/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0b1329',
          deep: '#0f172a',
          blue: '#1d4ed8',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          purple: '#6366f1',
          rose: '#f43f5e',
          light: '#f8fafc',
          card: '#ffffff',
          darkCard: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif']
      }
    },
  },
  plugins: [],
}
