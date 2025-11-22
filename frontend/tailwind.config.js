/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#1E40AF',
          'blue-light': '#3B82F6',
          'blue-dark': '#1E3A8A',
        },
        accent: {
          orange: '#FF6B35',
          'orange-light': '#FF8C5A',
          'orange-dark': '#E55A2B',
        },
        brand: {
          gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
        },
      },
      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)',
        'gradient-blue': 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
      },
      backgroundColor: {
        'gradient-orange': '#FF6B35',
      },
    },
  },
  plugins: [],
};
