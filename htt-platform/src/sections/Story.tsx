import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { Clock, Lock, Repeat, Shuffle, Zap } from 'lucide-react'
import { Eyebrow, FadeUp, RevealWords } from '../components/fx'
import { useCopy } from '../context/ModeContext'

const ICONS = [Shuffle, Zap, Repeat, Clock]

export function Problem() {
  const c = useCopy().problem
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28 sm:py-40">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 key={c.titleA} className="text-[clamp(2.2rem,5vw,4rem)] leading-[1] tracking-tightest">
            <RevealWords text={c.titleA} />
            <span className="text-neon-light">
              <RevealWords text={c.titleB} delay={0.3} />
            </span>
          </h2>
          <FadeUp delay={0.2}>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-bone/65">{c.intro}</p>
          </FadeUp>
        </div>

        <div className="space-y-4">
          {c.pains.map((p, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
            <FadeUp key={p.title} delay={i * 0.08}>
              <div className="group relative flex gap-5 overflow-hidden rounded-3xl border border-line bg-coal/60 p-6 transition-colors duration-500 hover:border-alarm/30 sm:p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-alarm/[0.07] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line bg-smoke text-alarm/80">
                  <Icon size={20} />
                </div>
                <div className="relative">
                  <h3 className="text-xl font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-bone/55">{p.text}</p>
                </div>
              </div>
            </FadeUp>
            )
          })}
          <FadeUp delay={0.3}>
            <p className="pt-8 text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
              {c.closerA}{' '}
              <span className="font-display uppercase text-neon-gradient">{c.closerB}</span>
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

export function Method() {
  const c = useCopy().method
  const STEPS = c.steps
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [step, setStep] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setStep(Math.min(4, Math.max(0, Math.floor(v * 5.2))))
  })
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 120])
  const lit = step >= 4

  return (
    <section id="metodo" ref={ref} className="relative h-[480vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div aria-hidden="true" className={`absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] transition-colors duration-1000 lg:left-[70%] ${lit ? 'bg-neon/25' : 'bg-amber/[0.06]'}`} />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-6 px-6 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 min-h-[260px] lg:order-1">
            <Eyebrow>Come funziona</Eyebrow>
            <motion.div key={step} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className={`font-mono text-xs uppercase tracking-[0.3em] ${lit ? 'text-emerald' : 'text-amber'}`}>{STEPS[step].kicker}</div>
              <h2 className="mt-4 text-[clamp(1.9rem,4.2vw,3.4rem)] font-bold leading-[1.02] tracking-tightest">{STEPS[step].title}</h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-bone/65">{STEPS[step].text}</p>
            </motion.div>
            <div className="mt-8 flex gap-2" aria-hidden="true">
              {STEPS.map((_, i) => (
                <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? (lit ? 'w-10 bg-neon' : 'w-10 bg-amber') : 'w-4 bg-line'}`} />
              ))}
            </div>
          </div>

          <div className="relative order-1 mx-auto aspect-square w-full max-w-[min(78vw,46vh)] lg:order-2 lg:max-w-[520px]">
            <motion.svg viewBox="0 0 400 400" className="h-full w-full" style={{ rotate }} aria-hidden="true">
              <defs>
                <linearGradient id="g-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFD460" />
                  <stop offset="100%" stopColor="#C98A00" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((i) => {
                const r = 180 - i * 36
                const on = step >= i + 1
                const c = 2 * Math.PI * r
                return (
                  <g key={i}>
                    <circle cx="200" cy="200" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="2 6" />
                    <circle
                      cx="200" cy="200" r={r} fill="none"
                      stroke={lit ? '#00FF41' : 'url(#g-ring)'}
                      strokeWidth={on ? 2.5 : 0}
                      strokeLinecap="round"
                      strokeDasharray={c}
                      strokeDashoffset={on ? 0 : c}
                      transform="rotate(-90 200 200)"
                      style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1), stroke 0.6s, stroke-width 0.3s' }}
                    />
                    <circle cx="200" cy={200 - r} r={on ? 6 : 3} fill={on ? (lit ? '#00FF41' : '#FFB800') : '#2A2A2A'} style={{ transition: 'all 0.6s' }} />
                  </g>
                )
              })}
            </motion.svg>

            <div className="absolute inset-0 grid place-items-center">
              <div className={`relative grid h-[34%] w-[34%] place-items-center rounded-full border transition-all duration-700 ${lit ? 'border-emerald/60 bg-emerald/10 shadow-[0_0_80px_rgba(0,255,65,0.45)]' : 'border-amber/30 bg-coal'}`}>
                {lit && <span className="absolute inset-0 animate-pulseRing rounded-full border border-emerald" />}
                <div className="text-center">
                  <div className={`font-mono text-[clamp(1.4rem,4vw,2.4rem)] font-medium tabular-nums ${lit ? 'text-emerald' : 'text-bone'}`}>
                    {Math.max(0, step)}/4
                  </div>
                  <div className={`mt-1 font-mono text-[9px] uppercase tracking-[0.25em] ${lit ? 'text-emerald' : 'text-mute'}`}>
                    {lit ? c.go : c.wait}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-coal px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
              <Lock size={11} className="text-neon" /> {c.badge}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
