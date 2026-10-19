/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0D0D0D',
        coal: '#121212',
        smoke: '#1A1A1A',
        line: 'rgba(255,255,255,0.08)',
        bone: '#E5E5E5',
        mute: '#8A8790',
        neon: {
          DEFAULT: '#00FF41',
          light: '#7CFFA0',
          deep: '#00A82B',
        },
        emerald: '#00FF41',
        alarm: '#FF0033',
        amber: '#FFB800',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Anton', 'Impact', 'sans-serif'],
        display: ['Anton', 'Impact', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '0.01em',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        shimmer: 'shimmer 6s linear infinite',
        pulseRing: 'pulseRing 2.4s cubic-bezier(0.2,0.6,0.3,1) infinite',
      },
    },
  },
  plugins: [],
}
