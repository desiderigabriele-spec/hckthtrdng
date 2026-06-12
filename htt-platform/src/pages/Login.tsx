import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Button from '../components/ui/Button'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/chat')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore di accesso'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-[#00FF41] glow-green-text tracking-widest">
            HACK_THE
          </h1>
          <h1 className="font-display text-4xl text-[#00FF41] glow-green-text tracking-widest">
            TRADING
          </h1>
          <p className="text-gray-500 font-mono text-xs mt-2">v2.0.1 — SISTEMA OPERATIVO</p>
        </div>

        {/* Terminal card */}
        <div className="bg-[#0D0D0D] border border-[#00FF41]/30 rounded-lg p-6 shadow-[0_0_30px_rgba(0,255,65,0.1)]">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#00FF41]/20">
            <div className="w-3 h-3 rounded-full bg-[#FF0033]" />
            <div className="w-3 h-3 rounded-full bg-[#FFB800]" />
            <div className="w-3 h-3 rounded-full bg-[#00FF41]" />
            <span className="ml-2 font-mono text-xs text-gray-500">terminal — login.sh</span>
          </div>

          <div className="font-mono text-[#00FF41] text-sm mb-6">
            <div className="text-gray-500">{`> autenticazione richiesta`}</div>
            <div className="text-gray-500">{`> inserire credenziali...`}</div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-gray-400 mb-1 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="user@htt.io"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2.5 text-sm font-mono text-[#E5E5E5] placeholder-gray-600 focus:outline-none focus:border-[#00FF41]/50 focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-gray-400 mb-1 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2.5 text-sm font-mono text-[#E5E5E5] placeholder-gray-600 focus:outline-none focus:border-[#00FF41]/50 focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all"
              />
            </div>

            {error && (
              <div className="bg-[#FF0033]/10 border border-[#FF0033]/40 rounded px-3 py-2 font-mono text-xs text-[#FF0033]">
                {`> ERRORE: ${error}`}
              </div>
            )}

            <Button type="submit" variant="primary" size="md" loading={loading} className="w-full mt-2">
              ACCEDI AL SISTEMA
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#00FF41]/10 text-center">
            <p className="font-mono text-xs text-gray-500">
              Nessun accesso?{' '}
              <Link
                to="/registrazione"
                className="text-[#00FF41] hover:underline transition-colors"
              >
                RICHIEDI ACCESSO
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
