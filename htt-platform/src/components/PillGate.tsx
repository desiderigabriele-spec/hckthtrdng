import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MatrixRain from './MatrixRain'
import type { Mode } from '../content/copy'

const LINES = [
  '> connessione stabilita',
  '> il mercato è un codice. si può imparare a leggerlo.',
  '> scegli da dove partire',
]

const PILLS: Record<Mode, { color: string; light: string; dark: string; title: string; text: string }> = {
  neofita: { color: '#2E8BFF', light: '#A9D0FF', dark: '#0A2F6B', title: 'Pillola blu · Neofita', text: 'Parto da zero. Spiegamelo in modo semplice.' },
  esperto: { color: '#FF0033', light: '#FF9AA8', dark: '#6B0016', title: 'Pillola rossa · Esperto', text: 'Ho già esperienza. Parlami tecnico.' },
}

// Posizione delle pillole nel video, in percentuale del fotogramma
const SPOTS: Record<Mode, { x: string; y: string }> = {
  neofita: { x: '23.3%', y: '59.5%' },
  esperto: { x: '75.8%', y: '59.5%' },
}

function PillSpot({ mode, active, onPick, onHover }: { mode: Mode; active: boolean; onPick: () => void; onHover: (h: boolean) => void }) {
  const p = PILLS[mode]
  return (
    <button
      type="button"
      aria-label={p.title}
      onClick={onPick}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      className="absolute grid h-[16%] w-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none"
      style={{ left: SPOTS[mode].x, top: SPOTS[mode].y }}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute h-[38%] w-[52%] rounded-full mix-blend-screen blur-xl"
        style={{ background: p.color }}
        animate={{ opacity: active ? [0.75, 1, 0.75] : [0.12, 0.3, 0.12], scale: active ? 1.5 : 1 }}
        transition={{ opacity: { duration: 2.2, repeat: Infinity }, scale: { type: 'spring', stiffness: 200, damping: 15 } }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute h-[30%] w-[38%] animate-pulseRing rounded-full border" style={{ borderColor: p.color }} />
    </button>
  )
}

export default function PillGate({ onChoose }: { onChoose: (m: Mode) => void }) {
  const [hover, setHover] = useState<Mode | null>(null)
  const [chosen, setChosen] = useState<Mode | null>(null)
  const [typed, setTyped] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Safari mobile avvia l'autoplay solo se "muted" e "playsinline" sono attributi reali del tag
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    v.defaultMuted = true
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    const play = () => { if (v.paused) v.play().catch(() => {}) }
    play()
    v.addEventListener('loadeddata', play)
    v.addEventListener('canplay', play)
    document.addEventListener('visibilitychange', play)
    window.addEventListener('touchstart', play, { passive: true })
    window.addEventListener('pointerdown', play)
    return () => {
      v.removeEventListener('loadeddata', play)
      v.removeEventListener('canplay', play)
      document.removeEventListener('visibilitychange', play)
      window.removeEventListener('touchstart', play)
      window.removeEventListener('pointerdown', play)
    }
  }, [])

  useEffect(() => {
    if (typed >= LINES.length) return
    const t = setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 400 : 900)
    return () => clearTimeout(t)
  }, [typed])

  const pick = (m: Mode) => {
    if (chosen) return
    setChosen(m)
    setTimeout(() => onChoose(m), 1100)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col items-center overflow-hidden bg-black"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <MatrixRain className="opacity-20" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_15%,#000_60%)]" />

      <div className="absolute left-8 top-8 z-10 hidden space-y-1 font-mono text-xs text-neon sm:block">
        {LINES.slice(0, typed).map((l, i) => (
          <motion.p key={l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className={i === typed - 1 ? 'cursor-blink' : ''}>{l}</motion.p>
        ))}
      </div>

      <div className="relative aspect-[3/5] w-full max-w-[calc(100svh*0.6)]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/gate/pillole.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/gate/pillole.mp4" type="video/mp4" />
          <source src="/gate/pillole.webm" type="video/webm" />
        </video>
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.4 }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-px w-[6%] bg-gradient-to-r from-black to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 -right-px w-[6%] bg-gradient-to-l from-black to-transparent" />
        <PillSpot mode="neofita" active={hover === 'neofita'} onPick={() => pick('neofita')} onHover={(h) => setHover(h ? 'neofita' : null)} />
        <PillSpot mode="esperto" active={hover === 'esperto'} onPick={() => pick('esperto')} onHover={(h) => setHover(h ? 'esperto' : null)} />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center bg-gradient-to-t from-black via-black/90 to-transparent px-4 pb-6 pt-24">
        <div className="flex w-full max-w-3xl flex-col items-center">
        <h1 className="text-center text-[clamp(1.8rem,5vw,3.4rem)] leading-none tracking-tightest">
          Scegli la tua <span className="text-neon-gradient">pillola</span>
        </h1>
        <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:gap-6">
          {(['neofita', 'esperto'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => pick(m)}
              onPointerEnter={() => setHover(m)}
              onPointerLeave={() => setHover(null)}
              className={`rounded-2xl border bg-coal/70 p-4 text-left backdrop-blur transition-all sm:p-5 ${hover === m ? 'scale-[1.02]' : ''}`}
              style={{ borderColor: hover === m ? PILLS[m].color : 'rgba(255,255,255,0.08)', boxShadow: hover === m ? `0 0 40px -10px ${PILLS[m].color}` : undefined }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] sm:text-[11px]" style={{ color: PILLS[m].color }}>{PILLS[m].title}</div>
              <div className="mt-2 text-sm leading-snug text-bone/80 sm:text-base">{PILLS[m].text}</div>
            </button>
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-[10px] text-mute">Puoi cambiare scelta in qualsiasi momento dal menu.</p>
        </div>
      </div>

      <AnimatePresence>
        {chosen && (
          <motion.div
            key="flash"
            className="pointer-events-none absolute inset-0 z-20"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            transition={{ duration: 1, ease: [0.7, 0, 0.3, 1] }}
            style={{ background: `radial-gradient(circle at 50% 50%, ${PILLS[chosen].light}, ${PILLS[chosen].color} 30%, #0D0D0D 75%)` }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
