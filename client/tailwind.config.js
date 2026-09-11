/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6366F1', light: '#818CF8', dark: '#4F46E5', deeper: '#3730A3' },
        secondary: { DEFAULT: '#8B5CF6', light: '#A78BFA', dark: '#7C3AED' },
        accent: { cyan: '#06B6D4', emerald: '#10B981', pink: '#EC4899', amber: '#F59E0B' },
        surface: {
          DEFAULT: '#ffffff',
          50: '#fafbff',
          100: '#f1f5f9',
          200: '#e2e8f0',
        },
        dark: {
          DEFAULT: '#0B0F19',
          50: '#111827',
          100: '#1E293B',
          200: '#334155',
          300: '#475569',
          card: '#12172B',
          surface: '#0F1629',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-1': 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 50%)',
        'mesh-2': 'radial-gradient(circle at 80% 80%, rgba(139,92,246,0.12) 0%, transparent 50%)',
        'mesh-3': 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.08) 0%, transparent 50%)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(99,102,241,0.15)',
        'glow-md': '0 0 30px rgba(99,102,241,0.2)',
        'glow-lg': '0 0 60px rgba(99,102,241,0.25)',
        'glow-cyan': '0 0 30px rgba(6,182,212,0.2)',
        'glass': '0 8px 32px rgba(0,0,0,0.08)',
        'glass-dark': '0 8px 32px rgba(0,0,0,0.4)',
        'card-hover': '0 20px 40px rgba(99,102,241,0.15), 0 0 0 1px rgba(99,102,241,0.1)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 10s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'gradient': 'gradient 8s ease infinite',
        'border-beam': 'border-beam 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '-200% 50%' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'border-beam': {
          '0%': { offsetDistance: '0%' },
          '100%': { offsetDistance: '100%' },
        },
      },
    },
  },
  plugins: [],
};
