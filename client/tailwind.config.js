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
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.7s ease-out',
        'fade-in-up': 'fade-in-up 0.7s ease-out'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
