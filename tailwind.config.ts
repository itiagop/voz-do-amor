import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        warmth: {
          50: '#fef7ee',
          100: '#fdedd3',
          200: '#f9d7a5',
          300: '#f5ba6d',
          400: '#f0983a',
          500: '#ec7d1a',
          600: '#dd6310',
          700: '#b74a0f',
          800: '#923b14',
          900: '#763314',
        },
        story: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36aaf5',
          500: '#0c8ee7',
          600: '#0070c4',
          700: '#01599f',
          800: '#064c83',
          900: '#0b406d',
        },
        cozy: {
          50: '#faf5f0',
          100: '#f3e8db',
          200: '#e6ceb5',
          300: '#d5af88',
          400: '#c48f5e',
          500: '#b87a46',
          600: '#a5663b',
          700: '#8a5132',
          800: '#71422f',
          900: '#5e392b',
        }
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        kid: ['Comic Sans MS', 'Chalkboard SE', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
    },
  },
  plugins: [],
}
export default config
