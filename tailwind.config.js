/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF8',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#1C1E21',
          muted: '#6B6F76',
          faint: '#9A9DA3',
        },
        line: '#E5E1D8',
        pine: {
          50: '#EEF3F1',
          100: '#D7E3DE',
          300: '#7DA396',
          500: '#2F5D50',
          600: '#264C42',
          700: '#1D3B33',
        },
        gold: {
          400: '#C9A227',
          500: '#B08D1F',
        },
        rust: {
          500: '#B4483A',
        },
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(28, 30, 33, 0.06)',
      },
    },
  },
  plugins: [],
}
