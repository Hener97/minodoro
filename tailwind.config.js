// Modernes Farbkonzept mit CSS-Variablen und Dual-Tone-System
const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./index.html", "./src/**/*.{jsx,js,ts,tsx}"],
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography')
  ]
}