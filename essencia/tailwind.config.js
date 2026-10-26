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
        essence: {
          dark: '#4C0E2B',
          wine: '#7A2142',
          rose: '#B33C62',
          gold: '#D9B07E',
          goldSoft: '#F3E0C4',
          cream: '#FBF4EA',
        },
        cream: {
          50: '#FBF4EA',
          100: '#F6ECDB',
          200: '#EFDCC0',
        },
        wine: {
          50: '#FBEFF3',
          100: '#F2D4DD',
          400: '#B33C62',
          500: '#7A2142',
          600: '#621534',
          700: '#4C0E2B',
          800: '#3A0A21',
          900: '#28061A',
        },
        gold: {
          300: '#E5C99A',
          400: '#D9B07E',
          500: '#C99A63',
          600: '#B5834C',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        protocol: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        'protocol-display': ['"Fraunces"', '"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(217,176,126,0.25), 0 18px 50px -20px rgba(0,0,0,0.55)',
        card: '0 10px 40px -15px rgba(0,0,0,0.55)',
        'card-hover': '0 22px 60px -20px rgba(0,0,0,0.65)',
        luxe: '0 20px 45px -20px rgba(76, 14, 43, 0.25)',
        'luxe-sm': '0 8px 24px -12px rgba(76, 14, 43, 0.18)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out both',
        'fade-in': 'fadeIn 0.45s ease-out both',
        'pop-in': 'popIn 0.3s ease-out both',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
