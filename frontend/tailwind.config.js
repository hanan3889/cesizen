/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "../backend/resources/views/**/*.blade.php",
    "./src/js/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cesizen': {
          green: '#4CAF50',
          yellow: '#FFEB38',
          'green-dark': '#388E3C',
          'yellow-dark': '#F9A825',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}