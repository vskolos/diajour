/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.svelte'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontSize: {
        '2xs': [
          '0.625rem',
          {
            lineHeight: '0.75rem',
          },
        ],
      },
      boxShadow: {
        'card': '0px 0px 8px 0px rgba(0, 0, 0, 0.05)',
        'card-dark': '0px 0px 8px 0px rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
}
