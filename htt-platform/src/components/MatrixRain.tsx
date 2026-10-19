import { useEffect, useRef } from 'react'

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0123456789XAU$%+-'

export default function MatrixRain({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const size = 16
    let cols = 0
    let drops: number[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(window.innerWidth / size)
      drops = Array.from({ length: cols }, () => Math.random() * -60)
      ctx.fillStyle = '#0D0D0D'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.fillStyle = 'rgba(13,13,13,0.09)'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.font = `${size - 2}px "JetBrains Mono", monospace`
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * size
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        ctx.fillStyle = Math.random() > 0.975 ? '#D6FFE0' : '#00FF41'
        ctx.fillText(ch, i * size, y)
        if (y > window.innerHeight && Math.random() > 0.975) drops[i] = 0
        drops[i] += 1
      }
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (let k = 0; k < 40; k++) draw()
      return () => window.removeEventListener('resize', resize)
    }

    let last = 0
    let raf = 0
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (t - last < 50) return
      last = t
      draw()
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none fixed inset-0 h-full w-full ${className}`} />
}
