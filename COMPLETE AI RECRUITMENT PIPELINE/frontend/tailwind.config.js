/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B4A',
          50: '#FFF5F3',
          100: '#FFE8E3',
          200: '#FFD1C7',
          300: '#FFB5A3',
          400: '#FF8F75',
          500: '#FF6B4A',
          600: '#FF4520',
          700: '#E62F00',
          800: '#B82500',
          900: '#8A1C00',
        },
        secondary: {
          DEFAULT: '#1E293B',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      }
    },
  },
  plugins: [],
}
