import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#F4F7F4',
        surface: '#FFFFFF',
        'surface-secondary': '#E9F0EB',
        primary: {
          DEFAULT: '#176B57',
          foreground: '#FFFFFF',
          dark: '#105342',
        },
        secondary: {
          DEFAULT: '#60766C',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#B17B3F',
          foreground: '#FFFFFF',
        },
        sage: '#A9C7B0',
        ink: '#172C26',
        text: {
          primary: '#172C26',
          secondary: '#60766C',
        },
        border: '#DCE6DE',
        success: '#287D62',
        warning: '#A66A20',
        error: '#B54747',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        button: '12px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(23, 44, 38, 0.05)',
        'card-hover': '0 14px 36px rgba(23, 44, 38, 0.1)',
        soft: '0 3px 14px rgba(23, 44, 38, 0.045)',
        premium: '0 24px 64px rgba(23, 44, 38, 0.12)',
        glow: '0 8px 24px rgba(23, 107, 87, 0.2)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        rise: 'rise 500ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.5s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
