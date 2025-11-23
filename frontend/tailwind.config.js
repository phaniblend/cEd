/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1d29',
          card: '#252836',
          hover: '#2d3142',
          border: '#3a3f54',
        },
        accent: {
          green: '#10b981',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          orange: '#f59e0b',
          red: '#ef4444',
        },
      },
    },
  },
  plugins: [],
}

