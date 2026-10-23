/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        essence: {
          dark: '#4C0E2B',
          wine: '#7A2142',
          rose: '#B33C62',
          gold: '#D9B07E',
          goldSoft: '#F3E0C4',
          cream: '#FBF4EA',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
