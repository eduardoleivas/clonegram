/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      
      },
    },
    extend: {
      colors: {
        'primary-500': '#29B4B9',
        'primary-600': '#248D96',
        'secondary-500': '#FFB620',
        'off-white': '#D0FFFE',
        'red': '#FF5A5A',
        'dark-1': '#000000',
        'dark-2': '#090A0A',
        'dark-3': '#101212',
        'dark-4': '#1E2121',
        'light-1': '#FFFFFF',
        'light-2': '#EFFCFC',
        'light-3': '#B3EEED',
        'light-4': '#7FE1E1',
      },
      screens: {
        'xs': '480px',
      
      },
      width: {
        '100': '20rem',
        '350': '350px',
        '420': '420px',
        '465': '465px',
      },
      height: {
        '100': '20rem',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],

      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};