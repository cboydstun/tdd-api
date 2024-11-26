/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: '#800080',
          blue: '#3c005a'
        },
        secondary: {
          purple: '#b390f9',
          blue: '#a8eaff',
          indigo: '#7759ff',
          white: '#ffffff'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
