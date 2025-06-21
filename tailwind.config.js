/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f97316', // orange-500
        'primary-light': '#fed7aa', // orange-200
        secondary: '#3b82f6', // blue-500
      },
    },
  },
  plugins: [],
}
