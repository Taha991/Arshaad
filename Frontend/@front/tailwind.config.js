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
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          base:    '#0B1120',
          surface: '#0F1729',
          card:    '#111827',
        },
        neon: {
          cyan:   '#22D3EE',
          violet: '#8B5CF6',
          blue:   '#3B82F6',
        },
      },
      backgroundImage: {
        'gradient-brand':   'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #22D3EE 100%)',
        'gradient-brand-r': 'linear-gradient(to right, #3B82F6, #8B5CF6, #22D3EE)',
        'gradient-radial':  'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'neon-cyan':   '0 0 20px rgba(34,211,238,0.35), 0 0 60px rgba(34,211,238,0.10)',
        'neon-blue':   '0 0 20px rgba(59,130,246,0.35)',
        'neon-violet': '0 0 20px rgba(139,92,246,0.35)',
        'glass':       '0 8px 32px rgba(0,0,0,0.37)',
        'card':        '0 4px 24px rgba(0,0,0,0.5)',
      },
      animation: {
        'blob':          'blob 7s infinite',
        'blob-delayed':  'blob 7s infinite 2s',
        'blob-slow':     'blob 10s infinite 4s',
        'gradient-x':    'gradient-x 15s ease infinite',
        'gradient-shift':'gradient-shift 6s ease infinite',
        'pulse-glow':    'pulse-glow 2s ease-in-out infinite',
        'spin-slow':     'spin 3s linear infinite',
        'float':         'float 6s ease-in-out infinite',
        'fade-in':       'fade-in 0.5s ease-out',
        'slide-up':      'slide-up 0.4s ease-out',
        'scale-in':      'scale-in 0.3s ease-out',
      },
      keyframes: {
        blob: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%':  { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'gradient-shift': {
          '0%':   { backgroundPosition: '0% 0%' },
          '50%':  { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34,211,238,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(34,211,238,0.6), 0 0 80px rgba(34,211,238,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      fontFamily: {
        sans:   ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
