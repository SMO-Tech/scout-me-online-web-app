/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'loading-bar': 'loading-bar 2s ease-in-out',
        'spin-slow': 'spin-slow 3s linear infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0) translateX(0)',
          },
          '33%': {
            transform: 'translateY(-20px) translateX(10px)',
          },
          '66%': {
            transform: 'translateY(-10px) translateX(-10px)',
          },
        },
        'loading-bar': {
          '0%': {
            width: '0%',
          },
          '100%': {
            width: '100%',
          },
        },
        'spin-slow': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        'float-slow': {
          '0%, 100%': {
            transform: 'translateY(0) translateX(0) scale(1)',
          },
          '33%': {
            transform: 'translateY(-30px) translateX(20px) scale(1.05)',
          },
          '66%': {
            transform: 'translateY(-15px) translateX(-20px) scale(0.95)',
          },
        },
      },
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
    },
  },
  plugins: [],
}
