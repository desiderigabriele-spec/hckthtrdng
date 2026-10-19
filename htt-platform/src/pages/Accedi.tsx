import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { CHAT_URL } from '../config'
import MatrixRain from '../components/MatrixRain'
import { TerminalBar } from '../components/fx'

export default function Accedi() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message.includes('Invalid login') ? 'Email o password non corretti.' : error.message)
      return
    }
    navigate('/area', { replace: true })
  }

  return (
    <div className="grain relative grid min-h-[100svh] place-items-center overflow-hidden px-4 py-16">
      <MatrixRain className="-z-10 opacity-20" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/15 blur-[130px]" />
      <Link to="/" className="absolute left-4 top-6 inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-bone sm:left-8">
        <ArrowLeft size={16} /> Torna al sito
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="neon-border relative w-full max-w-md rounded-[2rem] bg-coal/95 p-8 sm:p-10"
      >
        <TerminalBar label="login.sh — area riservata" />
        <div className="mx-auto mb-8 mt-8 grid h-14 w-14 place-items-center rounded-2xl border border-neon/40 bg-neon/10 text-neon">
          <Lock size={22} />
        </div>
        <h1 className="text-center text-4xl tracking-tightest text-neon-gradient">Area riservata</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-mute">
          Accedi con le credenziali che hai ricevuto dal team dopo l'iscrizione.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-mute">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line bg-ink/70 px-4 py-3.5 text-bone outline-none transition-colors placeholder:text-mute/50 focus:border-neon/60"
              placeholder="nome@email.com"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-mute">Password</span>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-line bg-ink/70 px-4 py-3.5 pr-12 text-bone outline-none transition-colors focus:border-neon/60"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-mute transition-colors hover:text-neon"
                aria-label={show ? 'Nascondi password' : 'Mostra password'}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && <p className="rounded-xl border border-alarm/30 bg-alarm/10 px-4 py-3 text-sm text-alarm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-neon group mt-2 flex w-full items-center justify-center gap-2 rounded-full py-4 font-semibold transition-shadow disabled:opacity-60">
            {loading ? 'Accesso in corso…' : 'Entra'}
            {!loading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        <div className="mt-8 border-t border-line pt-6 text-center text-sm text-mute">
          Non hai ancora le credenziali o hai perso la password?{' '}
          <a href={CHAT_URL} target="_blank" rel="noopener noreferrer" className="text-neon-light hover:underline">Scrivici in chat</a>
        </div>
      </motion.div>
    </div>
  )
}
