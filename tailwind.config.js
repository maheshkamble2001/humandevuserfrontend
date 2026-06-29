// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0e6ff',
          100: '#d9bfff',
          200: '#c299ff',
          300: '#ab73ff',
          400: '#944dff',
          500: '#7d26ff',
          600: '#641ecc',
          700: '#4b1799',
          800: '#320f66',
          900: '#190833'
        },
        secondary: {
          50: '#ffe6f0',
          100: '#ffb8d4',
          200: '#ff8ab8',
          300: '#ff5c9c',
          400: '#ff2e80',
          500: '#ff0064',
          600: '#cc0050',
          700: '#99003c',
          800: '#660028',
          900: '#330014'
        },
        dark: {
          50: '#f0f0f1',
          100: '#d4d4d6',
          200: '#b8b8bb',
          300: '#9c9ca0',
          400: '#808085',
          500: '#64646a',
          600: '#4a4a4f',
          700: '#313135',
          800: '#1a1a1d',
          900: '#0a0a0f'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif']
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shine': 'shine 2s linear infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-up': 'scaleUp 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite'
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 20px rgba(125, 38, 255, 0.5)' },
          '100%': { textShadow: '0 0 40px rgba(125, 38, 255, 0.8), 0 0 60px rgba(125, 38, 255, 0.3)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        scaleUp: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: []
};