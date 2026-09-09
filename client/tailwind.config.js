/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#4F46E5', light: '#818CF8', dark: '#3730A3' },
        secondary: { DEFAULT: '#7C3AED', light: '#A78BFA', dark: '#5B21B6' },
      },
    },
  },
  plugins: [],
};
