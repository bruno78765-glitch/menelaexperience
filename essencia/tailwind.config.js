/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        essencia: {
          900: '#4C0E2B',
          800: '#5C1140',
          700: '#7A2142',
          600: '#8E2A52',
          500: '#B33C62',
          400: '#C85A80',
          300: '#D98AA8',
        },
        champagne: {
          900: '#8A6940',
          700: '#A88253',
          500: '#D9B07E',
          400: '#E2C39A',
          300: '#EDD4B0',
          200: '#F4E3C9',
        },
        creme: {
          50: '#FBF4EA',
          100: '#F7EDDC',
          200: '#EFE0CB',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(217,176,126,0.25), 0 18px 50px -20px rgba(0,0,0,0.55)',
        card: '0 10px 40px -15px rgba(0,0,0,0.55)',
        'card-hover': '0 22px 60px -20px rgba(0,0,0,0.65)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out both',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
