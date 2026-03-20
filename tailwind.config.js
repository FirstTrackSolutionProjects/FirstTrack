/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { 
        "inter":['Inter','Inter'],
        "poppins":['Poppins','Poppins'],
        "domine":['Domine','Domine']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(.95)', opacity: '0.5' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-up': 'scaleUp 0.2s ease-out',
      }
    },
  },
  plugins: [],
}