/** @type {import('tailwindcss').Config} */
// const color = require()
module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-primary': '#014a72 !important' , // ntwrking //014a72
        'custom-primary-disabled': '#898989 !important',
        'custom-secondary': '#f8971f !important',
        'custom-tbr-red': '#e84721 !important',
        'custom-tbr-green': '#89b555 !important',
        'custom-tbr-gray': '#c3bfbf !important',
      }
    },
  },
  plugins: [],
}
