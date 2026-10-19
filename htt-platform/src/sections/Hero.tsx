import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Lock, Menu, X } from 'lucide-react'
import TraderScene from '../components/three/TraderScene'
import { Magnetic, RevealWords } from '../components/fx'
import { useCopy, useMode } from '../context/ModeContext'
import { BRAND } from '../config'

const NAV = [
  { href: '#metodo', label: 'Metodo' },
  { href: '#risultati', label: 'Risultati' },
  { href: '#team', label: 'Team' },
  { href: '#percorsi', label: 'Percorsi' },
  { href: '#faq', label: 'FAQ' },
]

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-3" aria-label={`${BRAND}, torna su`}>
      <span className="grid h-9 w-9 place-items-center rounded-lg border border-neon/50 bg-neon/10 font-mono text-sm font-bold text-neon">&gt;_</span>
      <span className="leading-none">
        <span className="block font-display text-[17px] tracking-[0.08em] text-neon [text-shadow:0_0_14px_rgba(0,255,65,0.5)]">{BRAND}</span>
        <span className="block font-mono text-[9px] tracking-[0.3em] text-mute">TRADING SYSTEM</span>
      </span>
    </a>
  )
}

function ModeSwitch({ className = '' }: { className?: string }) {
  const { mode, setMode } = useMode()
  return (
    <div className={`items-center rounded-full border border-line p-1 font-mono text-[10px] uppercase tracking-[0.15em] ${className}`} role="group" aria-label="Livello dei contenuti">
      {(['neofita', 'esperto'] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
          className={`rounded-full px-3 py-1.5 transition-colors ${mode === m ? (m === 'neofita' ? 'bg-[#2E8BFF] text-white' : 'bg-alarm text-white') : 'text-mute hover:text-bone'}`}
        >
          {m}
        </button>
      ))}
    </div>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5 ${scrolled ? 'glass shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]' : 'border border-transparent'}`}>
        <Logo />
        <div className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-mute transition-colors hover:text-bone">{n.label}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ModeSwitch className="hidden md:flex" />
          <Link to="/accedi" className="hidden items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-bone/80 transition-colors hover:border-neon/50 hover:text-bone sm:inline-flex">
            <Lock size={14} /> Area riservata
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-bone lg:hidden"
            aria-label={open ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass mx-auto mt-2 max-w-6xl rounded-3xl p-4 lg:hidden">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-bone/90 hover:bg-white/5">{n.label}</a>
          ))}
          <div className="mt-3 flex flex-col gap-3 border-t border-line pt-4">
            <ModeSwitch className="flex self-start" />
            <Link to="/accedi" className="flex items-center justify-center gap-2 rounded-full border border-line py-3 text-sm">
              <Lock size={14} /> Area riservata
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  )
}

export function Hero() {
  const c = useCopy().hero
  const { scrollY } = useScroll()
  const textY = useTransform(scrollY, [0, 700], [0, -120])
  const textOpacity = useTransform(scrollY, [0, 500], [1, 0])

  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden pb-14 pt-28 sm:items-center sm:pb-0">
      <TraderScene className="absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent sm:bg-gradient-to-r sm:from-ink sm:via-ink/75 sm:to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass mb-8 inline-flex items-center gap-3 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-bone/80 sm:text-[11px] sm:tracking-[0.25em]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-emerald" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
          </span>
          &gt; {c.chip}<span className="cursor-blink" />
        </motion.div>

        <h1 key={c.h1a} className="max-w-[18ch] text-[clamp(2.6rem,6.2vw,5.6rem)] leading-[0.95] tracking-tightest">
          <RevealWords text={c.h1a} delay={0.3} />
          <br />
          <RevealWords text={c.h1b} className="text-neon-gradient" delay={0.75} />
        </h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 }} className="mt-8 max-w-xl text-base leading-relaxed text-bone/75 sm:text-lg">
          {c.sub}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.4 }} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Magnetic>
            <a href="#percorsi" className="btn-neon group inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-semibold transition-shadow sm:w-auto">
              {c.cta1}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <a href="#metodo" className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-ink/60 px-7 py-4 text-base text-bone/85 transition-colors hover:border-neon/40 hover:text-bone">
            {c.cta2}
          </a>
        </motion.div>

        <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.7 }} className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-mute">
          {c.trust.map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-neon" />
              {t}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  )
}
