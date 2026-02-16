/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bitcoin: {
          50: '#faf8f3',
          100: '#f5f0e6',
          200: '#eae0cc',
          300: '#dfc9ad',
          400: '#d4b896',
          500: '#c9a87f',
          600: '#a68957',
          700: '#836a43',
          800: '#604a2f',
          900: '#3d2b1b',
        }
      }
    },
  },
  plugins: [],
}
