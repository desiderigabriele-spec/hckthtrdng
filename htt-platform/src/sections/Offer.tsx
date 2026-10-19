import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Lock, MessageCircle, Plus } from 'lucide-react'
import { Eyebrow, FadeUp, Magnetic, RevealWords, TerminalBar, Tilt } from '../components/fx'
import { BRAND, CHAT_URL, TIKTOK_URL } from '../config'
import { useCopy } from '../context/ModeContext'
import { Logo } from './Hero'

const chatFor = (pkg: string) => `${CHAT_URL.split('?')[0]}?text=${encodeURIComponent(`Ciao, vorrei informazioni sul percorso ${pkg} di ${BRAND}.`)}`

const PACKAGES = [
  {
    id: 'neofita',
    name: 'Neofita',
    tagline: 'Parti da zero, con qualcuno accanto.',
    who: 'Per chi non ha mai fatto trading o ha iniziato da poco.',
        items: [
      '12 videolezioni in 4 argomenti (3 lezioni ciascuno)',
      '5 sessioni one to one da 45 minuti di formazione e assistenza',
      'Indicatore trend a 4 conferme su TradingView',
      'Accesso alla community',
      'Supporto 24/7 in chat, senza scadenza',
    ],
  },
  {
    id: 'esperto',
    name: 'Esperto',
    tagline: 'Hai già esperienza. Ti serve precisione.',
    who: 'Per chi opera da 1-2 anni e vuole un metodo con regole chiare.',
        items: [
      'Videocorso completo sulla strategia',
      'Manuale del metodo in PDF',
      '1 sessione one to one da 45 minuti',
      'Indicatore trend a 4 conferme su TradingView',
      'Accesso alla community',
      'Supporto 24/7 in chat, senza scadenza',
    ],
  },
]

export function Packages() {
  const c = useCopy().packages
  const list = [...PACKAGES].sort((a) => (a.id === c.featured ? -1 : 1))
  return (
    <section id="percorsi" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-40">
      <div aria-hidden="true" className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-neon/10 blur-[140px]" />
      <div className="relative mx-auto max-w-2xl text-center">
        <Eyebrow>Scegli il tuo percorso</Eyebrow>
        <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1] tracking-tightest">
          <RevealWords text="Due punti di partenza." />
          <span className="font-serif font-normal tracking-normal text-neon-light">
            <RevealWords text="Un solo metodo." delay={0.25} />
          </span>
        </h2>
        <FadeUp delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-bone/65">{c.sub}</p>
        </FadeUp>
      </div>

      <div className="relative mt-16 grid gap-5 lg:grid-cols-2">
        {list.map((p, i) => {
          const featured = p.id === c.featured
          return (
          <FadeUp key={p.id} delay={i * 0.12}>
            <Tilt className="h-full rounded-[2rem]" max={5}>
              <div className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 sm:p-10 ${featured ? 'neon-border bg-gradient-to-b from-[#06180c] via-coal to-coal shadow-[0_40px_120px_-40px_rgba(0,255,65,0.45)]' : 'border border-line bg-coal'}`}>
                {featured && (
                  <div className="absolute right-6 top-6 rounded-full bg-neon px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-ink">
                    Consigliato per te
                  </div>
                )}
                <TerminalBar label={`percorso_${p.id}.sh`} />
                <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-neon">&gt; Percorso</div>
                <h3 className="mt-3 font-display text-5xl uppercase tracking-tightest sm:text-6xl" style={{ transform: 'translateZ(30px)' }}>
                  {p.name}
                </h3>
                <p className="mt-4 font-mono text-base text-neon">{p.tagline}</p>
                <p className="mt-2 text-sm text-mute">{p.who}</p>

                <ul className="mt-8 flex-1 space-y-3.5 border-t border-line pt-8">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-3 text-bone/85">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-neon/15 text-neon">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <a
                    href={chatFor(p.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 font-semibold transition-all ${featured ? 'btn-neon' : 'border border-neon/40 text-neon-light hover:bg-neon/10'}`}
                  >
                    Richiedi il percorso {p.name}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </a>
                  <p className="mt-3 text-center text-xs text-mute">Prezzo e disponibilità in chat · Parli prima con una persona del team</p>
                </div>
              </div>
            </Tilt>
          </FadeUp>
          )
        })}
      </div>
    </section>
  )
}

const PROCESS = [
  { n: '01', title: 'Scrivici in chat', text: 'Ci racconti il tuo livello e ti consigliamo il percorso più adatto. Senza impegno.' },
  { n: '02', title: 'Confermi l\'iscrizione', text: 'Completi il pagamento direttamente con il nostro team, in modo semplice e diretto.' },
  { n: '03', title: 'Ricevi le credenziali', text: 'Ti inviamo l\'accesso personale all\'area riservata di Zero Errori.' },
  { n: '04', title: 'Inizi subito', text: 'Videolezioni, indicatore, community e il tuo primo one to one ti aspettano.' },
]

export function Process() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28 sm:py-32">
      <div className="max-w-2xl">
        <Eyebrow>Come si entra</Eyebrow>
        <h2 className="text-[clamp(2rem,4.5vw,3.6rem)] font-bold leading-[1.02] tracking-tightest">
          <RevealWords text="Quattro passi." />
          <span className="font-serif font-normal tracking-normal text-neon-light">
            <RevealWords text="Il primo dura un messaggio." delay={0.2} />
          </span>
        </h2>
      </div>
      <div className="relative mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS.map((s, i) => (
          <FadeUp key={s.n} delay={i * 0.1} className="bg-ink">
            <div className="group relative h-full p-8 transition-colors duration-500 hover:bg-coal">
              <div className="font-serif text-6xl text-neon/30 transition-colors duration-500 group-hover:text-neon">{s.n}</div>
              <h3 className="mt-8 text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-bone/55">{s.text}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

export function Faq() {
  const FAQS = useCopy().faq
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Eyebrow>Domande frequenti</Eyebrow>
          <h2 className="text-[clamp(2rem,4.5vw,3.4rem)] font-bold leading-[1.02] tracking-tightest">
            <RevealWords text="Tutto quello" />
            <span className="font-serif font-normal tracking-normal text-neon-light">
              <RevealWords text="che vorresti chiederci." delay={0.2} />
            </span>
          </h2>
          <p className="mt-6 text-bone/60">
            Non trovi la risposta?{' '}
            <a href={CHAT_URL} target="_blank" rel="noopener noreferrer" className="text-neon-light underline-offset-4 hover:underline">Scrivici in chat</a>.
          </p>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className={`text-lg font-medium tracking-tight transition-colors ${isOpen ? 'text-bone' : 'text-bone/75'}`}>{f.q}</span>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ${isOpen ? 'rotate-45 border-neon bg-neon text-ink' : 'border-line text-bone/70'}`}>
                    <Plus size={16} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 leading-relaxed text-bone/60">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function FinalCta() {
  const c = useCopy().final
  return (
    <section className="relative overflow-hidden px-6 py-32 sm:py-48">
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/20 blur-[130px]" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon/15" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[66vmin] w-[66vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neon/[0.07]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="text-[clamp(2.6rem,7vw,6rem)] font-extrabold leading-[0.95] tracking-tightest">
          <RevealWords key={c.titleA} text={c.titleA} />
          <br />
          <RevealWords key={c.titleB} text={c.titleB} className="text-neon-gradient" delay={0.3} />
        </h2>
        <FadeUp delay={0.3}>
          <p className="mx-auto mt-8 max-w-lg text-lg text-bone/65">{c.sub}</p>
          <div className="mt-12 flex justify-center">
            <Magnetic>
              <a href={CHAT_URL} target="_blank" rel="noopener noreferrer" className="btn-neon group inline-flex items-center gap-3 rounded-full px-10 py-5 text-lg font-semibold transition-shadow">
                <MessageCircle size={20} />
                Parla con il team in chat
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
          </div>
          <p className="mt-6 text-sm text-mute">Senza impegno · Nessun pagamento automatico</p>
        </FadeUp>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line px-6 pb-10 pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-mute">Formazione sul trading dell'oro con metodo a 4 conferme. Corsi, strumenti e supporto.</p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm text-bone/70">
            <a href="#metodo" className="hover:text-bone">Metodo</a>
            <a href="#percorsi" className="hover:text-bone">Percorsi</a>
            <a href="#faq" className="hover:text-bone">FAQ</a>
            <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-bone">TikTok</a>
            <Link to="/accedi" className="inline-flex items-center gap-1.5 hover:text-bone"><Lock size={13} /> Area riservata</Link>
          </div>
        </div>
        <div className="mt-14 border-t border-line pt-8 text-xs leading-relaxed text-mute">
          <p>
            <span className="text-bone/60">Avvertenza sul rischio.</span> Il trading su strumenti finanziari a leva (CFD, forex, materie prime)
            comporta un elevato rischio di perdita del capitale e non è adatto a tutti gli investitori. I contenuti di questo sito e del corso
            hanno finalità esclusivamente formative e non costituiscono consulenza finanziaria né sollecitazione all'investimento.
            I risultati passati e di backtest non sono indicativi di risultati futuri.
          </p>
          <p className="mt-6">© {new Date().getFullYear()} {BRAND}. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}
