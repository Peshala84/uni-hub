/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom': {
          'dark': '#191E29',
          'blue': '#132D46', 
          'green': '#01C38D',
          'gray': '#696E79'
        }
      }
    },
  },
  plugins: [],
}
