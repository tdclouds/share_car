/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    corePlugins: {
      preflight: false,
    },
    extend: {},
    screens: {
      '2xl': { max: '1366px' },
      xl: { max: '1280px' },
      lg: { max: '1024px' },
      md: { max: '768px' },
      sm: { max: '640px' },
    },
  },
  plugins: [],
};
