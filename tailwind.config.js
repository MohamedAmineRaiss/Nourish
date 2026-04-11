/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#FDFCFA', 100: '#FBF8F4', 200: '#F5F0EA', 300: '#F0EBE3', 400: '#E0D8CC' },
        terra: { 400: '#E08B6D', 500: '#D4785C', 600: '#C06A4E', 700: '#A85A42' },
        bark: { 50: '#F0EBE3', 100: '#C4BAB0', 200: '#9B9590', 300: '#6A6460', 400: '#3A3632', 500: '#2D2A26', 600: '#242220', 700: '#1A1816' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '2xl': '16px', '3xl': '20px' },
    },
  },
  plugins: [],
};
