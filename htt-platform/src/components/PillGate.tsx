import { useEffect, useState } from 'react'
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

function Pill({ mode, x, y, rot, active, onPick, onHover }: { mode: Mode; x: number; y: number; rot: number; active: boolean; onPick: () => void; onHover: (h: boolean) => void }) {
  const p = PILLS[mode]
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={p.title}
      className="cursor-pointer outline-none"
      onClick={onPick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick() } }}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
    >
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={{ y: [0, -5, 0], scale: active ? 1.25 : 1 }}
        transition={{ y: { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: mode === 'esperto' ? 0.6 : 0 }, scale: { type: 'spring', stiffness: 260, damping: 16 } }}
      >
        <ellipse cx={x} cy={y} rx="58" ry="40" fill={p.color} opacity={active ? 0.55 : 0.3} filter="url(#pill-glow)" />
        <g transform={`rotate(${rot} ${x} ${y})`}>
          <rect x={x - 30} y={y - 12} width="60" height="24" rx="12" fill={`url(#pill-${mode})`} />
          <rect x={x - 30} y={y - 12} width="30" height="24" rx="12" fill="#000" opacity="0.18" />
          <rect x={x - 22} y={y - 8} width="40" height="5" rx="2.5" fill="#fff" opacity="0.55" />
        </g>
      </motion.g>
      <rect x={x - 70} y={y - 50} width="140" height="100" fill="transparent" />
    </g>
  )
}

function Figure({ hover, onPick, onHover }: { hover: Mode | null; onPick: (m: Mode) => void; onHover: (m: Mode | null) => void }) {
  const hand = (flip: boolean) => {
    const t = flip ? 'translate(800 0) scale(-1 1)' : undefined
    return (
      <g transform={t}>
        {/* braccio superiore */}
        <path d="M128 120 C92 160 80 230 84 330 L92 420 L170 432 L174 300 C174 230 168 170 150 130 Z" fill="url(#suit)" stroke="rgba(0,255,65,0.35)" strokeWidth="1.2" />
        {/* avambraccio verso chi guarda */}
        <path d="M90 392 C100 436 130 470 170 488 L218 502 L220 450 C190 440 176 422 170 398 Z" fill="url(#suit)" stroke="rgba(0,255,65,0.35)" strokeWidth="1.2" />
        <path d="M200 448 L228 450 L226 506 L198 502 Z" fill="#d9ddd9" />
        {/* mano a palmo in su */}
        <path d="M222 458 C254 440 312 438 348 458 C360 466 360 488 348 498 C312 520 256 520 224 506 Z" fill="url(#skin)" />
        <path d="M340 462 C360 446 380 444 388 452 C394 460 382 470 360 482 Z" fill="url(#skin)" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={232 + i * 26} y={496} width="24" height="30" rx="12" fill="url(#skin)" />
        ))}
        <path d="M238 470 C268 462 308 462 336 474" stroke="rgba(0,0,0,0.35)" strokeWidth="2" fill="none" />
      </g>
    )
  }

  return (
    <svg viewBox="0 0 800 640" className="h-auto w-full overflow-visible">
      <defs>
        <linearGradient id="suit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d2320" />
          <stop offset="1" stopColor="#0c0f0d" />
        </linearGradient>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a6450" />
          <stop offset="1" stopColor="#5a3e30" />
        </linearGradient>
        <linearGradient id="neck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a342a" />
          <stop offset="1" stopColor="#2a1d17" />
        </linearGradient>
        {(['neofita', 'esperto'] as const).map((m) => (
          <linearGradient key={m} id={`pill-${m}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={PILLS[m].light} />
            <stop offset="0.45" stopColor={PILLS[m].color} />
            <stop offset="1" stopColor={PILLS[m].dark} />
          </linearGradient>
        ))}
        <filter id="pill-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <linearGradient id="fade-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.7" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="fade" maskUnits="userSpaceOnUse" x="-50" y="-50" width="900" height="720">
          <rect x="-50" y="-50" width="900" height="720" fill="url(#fade-g)" />
        </mask>
        <pattern id="code" width="22" height="26" patternUnits="userSpaceOnUse">
          <text x="4" y="18" fontFamily="JetBrains Mono, monospace" fontSize="13" fill="rgba(0,255,65,0.09)">1</text>
        </pattern>
      </defs>

      <g mask="url(#fade)">
      {/* collo tagliato dal bordo alto */}
      <rect x="356" y="-10" width="88" height="80" fill="url(#neck)" />
      {/* giacca */}
      <path d="M330 40 C250 50 165 72 128 120 C104 152 98 200 100 260 L108 640 L692 640 L700 260 C702 200 696 152 672 120 C635 72 550 50 470 40 L400 330 Z" fill="url(#suit)" />
      <path d="M330 40 C250 50 165 72 128 120 C104 152 98 200 100 260 L108 640 L692 640 L700 260 C702 200 696 152 672 120 C635 72 550 50 470 40 L400 330 Z" fill="url(#code)" stroke="rgba(0,255,65,0.45)" strokeWidth="1.5" />
      {/* camicia e cravatta */}
      <path d="M332 42 L468 42 L400 330 Z" fill="#d9ddd9" />
      <path d="M354 40 L400 96 L376 124 L334 62 Z" fill="#eef1ee" />
      <path d="M446 40 L400 96 L424 124 L466 62 Z" fill="#eef1ee" />
      <path d="M386 94 L414 94 L408 122 L392 122 Z" fill="#0a0d0b" />
      <path d="M392 122 L408 122 L422 290 L400 318 L378 290 Z" fill="#0a0d0b" stroke="rgba(0,255,65,0.6)" strokeWidth="1" />
      {/* revers */}
      <path d="M330 40 L292 72 L320 150 L292 176 L400 330" fill="none" stroke="rgba(0,255,65,0.45)" strokeWidth="1.5" />
      <path d="M470 40 L508 72 L480 150 L508 176 L400 330" fill="none" stroke="rgba(0,255,65,0.45)" strokeWidth="1.5" />
      <path d="M520 210 L590 204" stroke="rgba(0,255,65,0.3)" strokeWidth="1.5" />
      <circle cx="400" cy="372" r="6" fill="#050605" stroke="rgba(0,255,65,0.5)" />
      <circle cx="400" cy="444" r="6" fill="#050605" stroke="rgba(0,255,65,0.5)" />

      {hand(false)}
      {hand(true)}
      </g>

      <Pill mode="neofita" x={286} y={466} rot={-14} active={hover === 'neofita'} onPick={() => onPick('neofita')} onHover={(h) => onHover(h ? 'neofita' : null)} />
      <Pill mode="esperto" x={514} y={466} rot={14} active={hover === 'esperto'} onPick={() => onPick('esperto')} onHover={(h) => onHover(h ? 'esperto' : null)} />
    </svg>
  )
}

export default function PillGate({ onChoose }: { onChoose: (m: Mode) => void }) {
  const [hover, setHover] = useState<Mode | null>(null)
  const [chosen, setChosen] = useState<Mode | null>(null)
  const [typed, setTyped] = useState(0)

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
      className="fixed inset-0 z-[80] flex flex-col items-center overflow-hidden bg-ink"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <MatrixRain className="opacity-25" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_20%,#0D0D0D_75%)]" />

      <div className="absolute left-8 top-8 z-10 hidden space-y-1 font-mono text-xs text-neon sm:block">
        {LINES.slice(0, typed).map((l, i) => (
          <motion.p key={l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className={i === typed - 1 ? 'cursor-blink' : ''}>{l}</motion.p>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-[150vw] max-w-none sm:w-[min(96vw,820px,calc(64svh*1.25))]"
      >
        <Figure hover={hover} onPick={pick} onHover={setHover} />
      </motion.div>

      <div className="relative z-10 mt-2 flex w-full max-w-3xl flex-1 flex-col items-center px-4 pb-6 sm:mt-4">
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

      <AnimatePresence>
        {chosen && (
          <motion.div
            key="flash"
            className="pointer-events-none absolute inset-0 z-20"
            initial={{ clipPath: 'circle(0% at 50% 72%)' }}
            animate={{ clipPath: 'circle(150% at 50% 72%)' }}
            transition={{ duration: 1, ease: [0.7, 0, 0.3, 1] }}
            style={{ background: `radial-gradient(circle at 50% 72%, ${PILLS[chosen].light}, ${PILLS[chosen].color} 30%, #0D0D0D 75%)` }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
