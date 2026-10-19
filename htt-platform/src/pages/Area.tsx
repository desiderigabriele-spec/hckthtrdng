import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Calendar, Check, ChevronDown, LogOut, MessageCircle, PlayCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { MODULI, RISORSE } from '../data/corso'
import type { Lezione } from '../data/corso'
import { CHAT_URL } from '../config'
import MatrixRain from '../components/MatrixRain'

const STORAGE_KEY = 'zero-errori:completate'

function loadDone(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export default function Area() {
  const { session, signOut } = useAuth()
  const [done, setDone] = useState<string[]>(loadDone)
  const [openModule, setOpenModule] = useState<string>(MODULI[0].id)
  const [current, setCurrent] = useState<Lezione>(MODULI[0].lezioni[0])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)) } catch { /* storage non disponibile */ }
  }, [done])

  const total = useMemo(() => MODULI.reduce((n, m) => n + m.lezioni.length, 0), [])
  const pct = Math.round((done.length / total) * 100)
  const name = session?.user.email?.split('@')[0] ?? ''
  const isDone = done.includes(current.id)

  const toggleDone = () => setDone((d) => (d.includes(current.id) ? d.filter((x) => x !== current.id) : [...d, current.id]))

  return (
    <div className="grain relative min-h-[100svh]">
      <MatrixRain className="-z-10 opacity-[0.07]" />
      <header className="sticky top-0 z-40 border-b border-line bg-ink/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="relative grid h-8 w-8 place-items-center rounded-full border border-neon/50">
              <span className="font-serif text-lg leading-none text-neon-light">0</span>
              <span className="absolute h-[1.5px] w-4 rotate-[-35deg] bg-neon-light" />
            </span>
            <span className="font-display text-base tracking-[0.08em] text-neon">ZERO_ERRORI</span>
          </Link>
          <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-bone/75 transition-colors hover:border-neon/40 hover:text-bone">
            <LogOut size={14} /> Esci
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-neon">Area riservata</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tightest sm:text-5xl">
              Bentornato<span className="font-serif font-normal text-neon-light">{name ? `, ${name}` : ''}</span>
            </h1>
          </div>
          <div className="w-full sm:w-72">
            <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
              <span>Progresso</span>
              <span className="text-bone">{done.length}/{total} · {pct}%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-smoke">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-neon-deep via-neon to-neon-light" animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section>
            <div className="neon-border relative aspect-video overflow-hidden rounded-3xl bg-coal">
              {current.videoUrl ? (
                <iframe
                  src={current.videoUrl}
                  title={current.titolo}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_40%,rgba(0,255,65,0.18),transparent_60%)] p-6 text-center">
                  <div>
                    <PlayCircle size={56} strokeWidth={1} className="mx-auto text-neon/70" />
                    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-mute">Video in arrivo</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">{current.titolo}</h2>
              <button
                type="button"
                onClick={toggleDone}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${isDone ? 'bg-emerald/15 text-emerald' : 'border border-line text-bone/80 hover:border-neon/40'}`}
              >
                <Check size={15} /> {isDone ? 'Completata' : 'Segna come completata'}
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <a href={CHAT_URL} target="_blank" rel="noopener noreferrer" className="group rounded-3xl border border-line bg-coal p-6 transition-colors hover:border-neon/40">
                <Calendar size={20} className="text-neon" />
                <h3 className="mt-4 font-semibold">Prenota un one to one</h3>
                <p className="mt-1 text-sm text-mute">Sessione da 45 minuti con il team.</p>
              </a>
              <a href={CHAT_URL} target="_blank" rel="noopener noreferrer" className="group rounded-3xl border border-line bg-coal p-6 transition-colors hover:border-neon/40">
                <MessageCircle size={20} className="text-neon" />
                <h3 className="mt-4 font-semibold">Supporto 24/7</h3>
                <p className="mt-1 text-sm text-mute">Scrivici in chat per qualsiasi dubbio.</p>
              </a>
            </div>
          </section>

          <aside className="space-y-3">
            {MODULI.map((m) => {
              const open = openModule === m.id
              const doneInModule = m.lezioni.filter((l) => done.includes(l.id)).length
              return (
                <div key={m.id} className={`overflow-hidden rounded-3xl border transition-colors ${open ? 'border-neon/30 bg-coal' : 'border-line bg-coal/50'}`}>
                  <button type="button" onClick={() => setOpenModule(open ? '' : m.id)} className="flex w-full items-center gap-4 p-5 text-left" aria-expanded={open}>
                    <span className="font-serif text-3xl text-neon/70">{m.numero}</span>
                    <span className="flex-1">
                      <span className="block font-semibold">{m.titolo}</span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-mute">{doneInModule}/{m.lezioni.length} lezioni</span>
                    </span>
                    <ChevronDown size={18} className={`text-mute transition-transform ${open ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <p className="px-5 text-sm leading-relaxed text-mute">{m.descrizione}</p>
                        <ul className="p-3">
                          {m.lezioni.map((l) => {
                            const active = current.id === l.id
                            const completed = done.includes(l.id)
                            return (
                              <li key={l.id}>
                                <button
                                  type="button"
                                  onClick={() => setCurrent(l)}
                                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition-colors ${active ? 'bg-neon/10 text-bone' : 'text-bone/70 hover:bg-white/5'}`}
                                >
                                  <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${completed ? 'border-emerald bg-emerald/20 text-emerald' : active ? 'border-neon text-neon' : 'border-line text-mute'}`}>
                                    {completed ? <Check size={12} /> : <PlayCircle size={12} />}
                                  </span>
                                  {l.titolo}
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            <div className="pt-6">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-mute">Strumenti</div>
              <div className="space-y-3">
                {RISORSE.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-coal/50 p-4">
                    <div>
                      <div className="text-sm font-semibold">{r.titolo}</div>
                      <div className="text-xs text-mute">{r.descrizione}</div>
                    </div>
                    {r.url ? (
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 rounded-full border border-neon/40 px-3 py-1.5 text-xs text-neon-light hover:bg-neon/10">
                        {r.cta} <ArrowUpRight size={12} />
                      </a>
                    ) : (
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-mute">In arrivo</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
