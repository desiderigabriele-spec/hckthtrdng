import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Lock, Menu, X } from 'lucide-react'
import GoldOrb from '../components/three/GoldOrb'
import { Magnetic, RevealWords } from '../components/fx'

const NAV = [
  { href: '#metodo', label: 'Metodo' },
  { href: '#risultati', label: 'Risultati' },
  { href: '#team', label: 'Team' },
  { href: '#percorsi', label: 'Percorsi' },
  { href: '#faq', label: 'FAQ' },
]

export function Logo() {
  return (
    <a href="#top" className="group flex items-center gap-3" aria-label="Team Zero Errori, torna su">
      <span className="relative grid h-9 w-9 place-items-center rounded-full border border-neon/50 bg-gradient-to-b from-neon/20 to-transparent">
        <span className="font-serif text-xl leading-none text-neon-light">0</span>
        <span className="absolute h-[1.5px] w-5 rotate-[-35deg] bg-neon-light" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-[17px] tracking-[0.08em] text-neon [text-shadow:0_0_14px_rgba(0,255,65,0.5)]">ZERO_ERRORI</span>
        <span className="block font-mono text-[9px] tracking-[0.3em] text-mute">v1.0 · TRADING SYSTEM</span>
      </span>
    </a>
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
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-5 ${
          scrolled ? 'glass shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]' : 'border border-transparent'
        }`}
      >
        <Logo />
        <div className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-mute transition-colors hover:text-bone">
              {n.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/accedi"
            className="hidden items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-bone/80 transition-colors hover:border-neon/50 hover:text-bone sm:inline-flex"
          >
            <Lock size={14} /> Area riservata
          </Link>
          <a href="#percorsi" className="btn-neon hidden rounded-full px-5 py-2 text-sm font-semibold transition-shadow sm:inline-flex">
            Inizia
          </a>
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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass mx-auto mt-2 max-w-6xl rounded-3xl p-4 lg:hidden"
        >
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-bone/90 hover:bg-white/5">
              {n.label}
            </a>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link to="/accedi" className="flex items-center justify-center gap-2 rounded-full border border-line py-3 text-sm">
              <Lock size={14} /> Area riservata
            </Link>
            <a href="#percorsi" onClick={() => setOpen(false)} className="btn-neon flex items-center justify-center rounded-full py-3 text-sm font-semibold">
              Inizia
            </a>
          </div>
        </motion.div>
      )}
    </header>
  )
}

export function Hero() {
  const { scrollY } = useScroll()
  const textY = useTransform(scrollY, [0, 700], [0, -120])
  const textOpacity = useTransform(scrollY, [0, 500], [1, 0])

  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 sm:items-center sm:pb-0">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_60%_45%,#000_20%,transparent_70%)]"
      />
      <div aria-hidden="true" className="absolute right-[-10%] top-[10%] h-[70vh] w-[70vh] rounded-full bg-neon/20 blur-[140px]" />

      <GoldOrb className="absolute inset-x-0 top-[3%] h-[50%] opacity-90 sm:inset-y-0 sm:left-auto sm:right-[-16%] sm:top-0 sm:h-full sm:w-[64%] sm:opacity-100" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-ink via-ink/85 to-transparent sm:hidden" />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass mb-8 inline-flex items-center gap-3 rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.25em] text-bone/80 sm:text-[11px]"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulseRing rounded-full bg-emerald" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
          </span>
          &gt; 4 conferme · oro xau/usd · 15m<span className="cursor-blink" />
        </motion.div>

        <h1 className="max-w-[19ch] text-[clamp(2.6rem,6.4vw,5.8rem)] font-extrabold leading-[0.95] tracking-tightest">
          <RevealWords text="Il mercato non premia chi fa di più." delay={0.3} />
          <br />
          <span className="font-serif font-normal tracking-normal">
            <RevealWords text="Premia chi sbaglia di meno." className="text-neon-gradient" delay={0.75} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-bone/70 sm:text-lg"
        >
          Un indicatore che resta in silenzio finché <span className="text-bone">quattro conferme</span> non si allineano.
          Solo allora entri. Niente scalping compulsivo, niente ore incollato al grafico: un trading lucido, misurabile, sostenibile.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <Magnetic>
            <a href="#percorsi" className="btn-neon group inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-semibold transition-shadow sm:w-auto">
              Scopri il tuo percorso
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <a href="#metodo" className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-7 py-4 text-base text-bone/85 transition-colors hover:border-neon/40 hover:text-bone">
            Come funziona il metodo
          </a>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-mute"
        >
          {['Backtest pubblico su TradingView', 'Supporto 24/7 a vita', 'Live su TikTok'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-neon" />
              {t}
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-mute">Scorri</span>
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-neon"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  )
}
