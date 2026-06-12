/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0D0D0D',
        'bg-secondary': '#1A1A1A',
        'bg-highlight': '#0F2010',
        'terminal-green': '#00FF41',
        'amber': '#FFB800',
        'red-htt': '#FF0033',
        'text-primary': '#E5E5E5',
        'text-dim': '#888888',
        'border-htt': '#2A2A2A',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0,255,65,0.4)',
        'glow-amber': '0 0 20px rgba(255,184,0,0.4)',
        'glow-red': '0 0 20px rgba(255,0,51,0.4)',
      },
    },
  },
  plugins: [],
}
