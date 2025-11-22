/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f9ff',
          100: '#eaf2ff',
          200: '#d6e4ff',
          300: '#b3cdff',
          400: '#80a9ff',
          500: '#4d85ff',
          600: '#1a61ff',
          700: '#0047e6',
          800: '#0037b3',
          900: '#002680'
        }
      }
    }
  },
  plugins: []
}