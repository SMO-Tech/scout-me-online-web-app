/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
        shimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': {
            opacity: '0.4',
            'box-shadow': '0 0 20px rgba(234, 88, 12, 0.15)',
          },
          '50%': {
            opacity: '0.7',
            'box-shadow': '0 0 32px rgba(234, 88, 12, 0.25)',
          },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'loading-bar': 'loading-bar 2s ease-in-out',
        'spin-slow': 'spin-slow 3s linear infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
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
