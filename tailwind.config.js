/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#1e3a8a',
          50: '#eff3ff',
          100: '#dbe4ff',
          200: '#bfcfff',
          300: '#93aeff',
          400: '#6083f7',
          500: '#3b5bdb',
          600: '#2f4ac4',
          700: '#2a3fa8',
          800: '#1e3a8a',
          900: '#1e3276',
        },
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        violet: '#8b5cf6',
        border: 'hsl(214 20% 88%)',
        muted: 'hsl(214 20% 92%)',
      },
      borderRadius: {
        DEFAULT: '0.625rem',
        sm: '0.375rem',
        md: '0.625rem',
        lg: '0.875rem',
        xl: '1rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)',
        sidebar: '2px 0 8px 0 rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};