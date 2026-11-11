/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dce5f2',
          200: '#bccbe4',
          300: '#8fa8cf',
          400: '#5d80b4',
          500: '#3a6097',
          600: '#2c4a7c',
          700: '#253c64',
          800: '#203354',
          900: '#1d2c46',
          950: '#131d30',
        },
        accent: {
          50: '#f6f2fd',
          100: '#efe7fb',
          200: '#dfd0f6',
          300: '#c7aeee',
          400: '#a884e4',
          500: '#8b5cd6',
          600: '#7a41c2',
          700: '#6634a1',
          800: '#562e83',
          900: '#47296b',
          950: '#2c1442',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(19,29,48,0.04), 0 8px 24px -8px rgba(19,29,48,0.10)',
        'card-hover':
          '0 2px 4px rgba(19,29,48,0.05), 0 16px 40px -12px rgba(19,29,48,0.18)',
      },
    },
  },
  plugins: [],
};
