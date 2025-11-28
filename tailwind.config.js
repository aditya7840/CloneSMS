/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a', // Deepest Netflix Black
        surface: '#181818',    // Card Background
        primary: '#E50914',    // Netflix Red
        secondary: '#b3b3b3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-fade': 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)',
        'hero-gradient': 'linear-gradient(to right, #0a0a0a 20%, transparent 100%)',
      }
    },
  },
  plugins: [],
}