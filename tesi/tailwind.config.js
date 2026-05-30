/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-gold': '#b8860b',
        'burnt-red': '#8b0000',
        'crimson-red': '#dc143c',
        'peru': '#cd853f',
      },
      fontFamily: {
        'magneto': ['Magneto', 'sans-serif'],
        'matura': ['Matura MT Script Capitals', 'sans-serif'],
        'trebuchet': ['Trebuchet MS', 'sans-serif'],
      },
      animation: {
        'color-shift': 'colorShift 4s ease-out infinite alternate',
      },
      keyframes: {
        colorShift: {
          '0%': { color: 'white' },
          '25%': { color: 'yellow' },
          '50%': { color: 'darkorange' },
          '100%': { color: 'red' },
        },
      },
    },
  },
  plugins: [],
}
