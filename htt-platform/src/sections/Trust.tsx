import { ArrowUpRight, Check, X } from 'lucide-react'
import { Counter, Eyebrow, FadeUp, RevealWords, Tilt } from '../components/fx'
import { BACKTEST_URL, TIKTOK_URL } from '../config'
import { useCopy } from '../context/ModeContext'

const STATS = [
  { value: 3.5, decimals: 1, suffix: '', label: 'Profit Factor' },
  { value: 15, decimals: 0, suffix: 'm', label: 'Timeframe' },
  { value: 1, decimals: 0, suffix: '%', label: 'Rischio max' },
  { value: 4, decimals: 0, suffix: '', label: 'Conferme' },
]

export function Proof() {
  const c = useCopy().proof
  return (
    <section id="risultati" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-40">
      <div className="max-w-3xl">
        <Eyebrow>I numeri, non le promesse</Eyebrow>
        <h2 key={c.titleA} className="text-[clamp(2.2rem,5vw,4rem)] leading-[1] tracking-tightest">
          <RevealWords text={c.titleA} />
          <span className="text-neon-light">
            <RevealWords text={c.titleB} delay={0.25} />
          </span>
        </h2>
        <FadeUp delay={0.15}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/65">{c.sub}</p>
        </FadeUp>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <FadeUp key={s.label} delay={i * 0.08}>
            <Tilt className="h-full rounded-3xl" max={8}>
              <div className="neon-border relative h-full overflow-hidden rounded-3xl bg-gradient-to-b from-smoke to-coal p-7">
                <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute">{s.label}</div>
                <div className="mt-6 text-6xl font-bold tracking-tightest text-neon-gradient" style={{ transform: 'translateZ(40px)' }}>
                  <Counter to={s.value} decimals={s.decimals} suffix={s.suffix} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-bone/55">{c.notes[i]}</p>
              </div>
            </Tilt>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={0.2}>
        <div className="mt-10 flex flex-col gap-6 rounded-3xl border border-line bg-coal/50 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl leading-relaxed text-bone/70">{c.explainer}</p>
          {BACKTEST_URL && (
            <a href={BACKTEST_URL} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-neon/40 px-6 py-3 text-sm text-neon-light transition-colors hover:bg-neon/10">
              Apri il backtest <ArrowUpRight size={16} />
            </a>
          )}
        </div>
        <p className="mt-4 text-xs text-mute">
          I dati di backtest si riferiscono a simulazioni su dati storici e non garantiscono risultati futuri.
        </p>
      </FadeUp>
    </section>
  )
}

export function Compare() {
  const c = useCopy().compare
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Due modi di fare trading</Eyebrow>
        <h2 key={c.titleA} className="text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.02] tracking-tightest">
          <RevealWords text={c.titleA} />
          <span className="text-neon-light">
            <RevealWords text={c.titleB} delay={0.25} />
          </span>
        </h2>
      </div>

      <FadeUp delay={0.15}>
        <div className="mt-16 overflow-hidden rounded-3xl border border-line">
          <div className="grid grid-cols-[1fr_1fr] text-sm sm:grid-cols-[0.8fr_1fr_1fr]">
            <div className="hidden border-b border-line bg-coal p-5 sm:block" />
            <div className="border-b border-line bg-coal p-5 font-mono text-[11px] uppercase tracking-[0.2em] text-alarm/80">{c.badLabel}</div>
            <div className="border-b border-l border-line bg-neon/[0.07] p-5 font-mono text-[11px] uppercase tracking-[0.2em] text-neon">{c.goodLabel}</div>
            {c.rows.map((r) => (
              <div key={r.k} className="contents">
                <div className="hidden border-b border-line bg-coal/60 p-5 text-mute sm:block">{r.k}</div>
                <div className="flex items-start gap-3 border-b border-line bg-coal/40 p-5 text-bone/45">
                  <X size={16} className="mt-0.5 shrink-0 text-alarm/70" />
                  <span><span className="block text-[11px] uppercase tracking-wider text-mute sm:hidden">{r.k}</span>{r.bad}</span>
                </div>
                <div className="flex items-start gap-3 border-b border-l border-line bg-neon/[0.04] p-5 text-bone">
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald" />
                  <span><span className="block text-[11px] uppercase tracking-wider text-mute sm:hidden">{r.k}</span>{r.good}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  )
}

const TEAM = [
  {
    initials: 'FZ',
    name: 'Francesco Zammartino',
    role: 'CEO · Assistenza clienti',
    text: 'È la prima persona con cui parli. Ti segue dall\'iscrizione al supporto di ogni giorno.',
  },
  {
    initials: 'FD',
    name: 'Filippo Danesi',
    role: 'Ideatore del metodo · Area tecnica',
    text: 'Ha costruito e testato il metodo a 4 conferme e l\'indicatore su TradingView.',
  },
  {
    initials: 'A',
    name: 'Andrea',
    role: 'Live · Social',
    text: 'Porta il metodo in diretta su TikTok, dove puoi vedere il ragionamento dietro ogni operazione.',
    link: { href: TIKTOK_URL, label: '@ildiariodiuntrader' },
  },
]

export function Team() {
  return (
    <section id="team" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-40">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end">
        <div>
          <Eyebrow>Chi c'è dietro</Eyebrow>
          <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1] tracking-tightest">
            <RevealWords text="Persone vere." />
            <span className="font-serif font-normal tracking-normal text-neon-light">
              <RevealWords text="Sempre raggiungibili." delay={0.25} />
            </span>
          </h2>
        </div>
        <FadeUp delay={0.1}>
          <p className="max-w-lg text-lg leading-relaxed text-bone/65 lg:justify-self-end">
            Niente guru senza volto e niente bot. Dietro il metodo c'è un team con ruoli precisi,
            che risponde in chat 24 ore su 24.
          </p>
        </FadeUp>
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {TEAM.map((m, i) => (
          <FadeUp key={m.name} delay={i * 0.1}>
            <Tilt className="h-full rounded-3xl" max={7}>
              <article className="relative h-full overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-smoke to-coal p-7">
                <div className="relative mb-10 h-40 overflow-hidden rounded-2xl bg-ink" style={{ transform: 'translateZ(30px)' }}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,65,0.35),transparent_60%)]" />
                  <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px]" />
                  <span className="absolute bottom-3 left-5 font-serif text-7xl text-neon-gradient">{m.initials}</span>
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{m.name}</h3>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-neon">{m.role}</div>
                <p className="mt-4 leading-relaxed text-bone/60">{m.text}</p>
                {m.link && (
                  <a href={m.link.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm text-neon-light hover:underline">
                    {m.link.label} <ArrowUpRight size={14} />
                  </a>
                )}
              </article>
            </Tilt>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
