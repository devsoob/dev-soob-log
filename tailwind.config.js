// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-pretendard)'],
      },
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            }
          }
        }
      },
      keyframes: {
        loading: {
          '0%': { width: '0%', marginLeft: '0%' },
          '50%': { width: '30%', marginLeft: '35%' },
          '100%': { width: '0%', marginLeft: '100%' }
        }
      },
      animation: {
        loading: 'loading 1s ease-in-out infinite'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
