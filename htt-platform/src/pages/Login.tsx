import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/chat')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Errore di accesso')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoadingGoogle(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/chat` },
    })
    if (error) {
      setError(error.message)
      setLoadingGoogle(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-[#00FF41] tracking-widest" style={{ textShadow: '0 0 20px rgba(0,255,65,0.5)' }}>
            HACK_THE<br />TRADING
          </h1>
          <p className="text-gray-500 font-mono text-xs mt-2">v2.0.1 — SISTEMA OPERATIVO</p>
        </div>

        <div className="bg-[#0D0D0D] border border-[#00FF41]/30 rounded-lg p-6 shadow-[0_0_30px_rgba(0,255,65,0.1)]">
          {/* Decorazione terminale */}
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#00FF41]/20">
            <div className="w-3 h-3 rounded-full bg-[#FF0033]" />
            <div className="w-3 h-3 rounded-full bg-[#FFB800]" />
            <div className="w-3 h-3 rounded-full bg-[#00FF41]" />
            <span className="ml-2 font-mono text-xs text-gray-500">terminal — login.sh</span>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loadingGoogle}
            className="w-full flex items-center justify-center gap-3 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#00FF41]/40 text-white font-mono text-sm py-3 rounded transition-all disabled:opacity-50 mb-5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loadingGoogle ? '> connessione...' : 'Continua con Google'}
          </button>

          {/* Divisore */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#2A2A2A]" />
            <span className="font-mono text-xs text-gray-600">oppure</span>
            <div className="flex-1 h-px bg-[#2A2A2A]" />
          </div>

          {error && (
            <div className="bg-[#FF0033]/10 border border-[#FF0033]/40 rounded px-3 py-2 font-mono text-xs text-[#FF0033] mb-4">
              {`> ERRORE: ${error}`}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-gray-400 mb-1 uppercase">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="user@htt.io"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2.5 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#00FF41]/50 transition-all" />
            </div>
            <div>
              <label className="block font-mono text-xs text-gray-400 mb-1 uppercase">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2.5 pr-10 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#00FF41]/50 transition-all" />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00FF41] transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#00FF41] text-[#0D0D0D] font-display text-lg py-2.5 rounded disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all">
              {loading ? '> accesso...' : 'ACCEDI'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#00FF41]/10 text-center">
            <p className="font-mono text-xs text-gray-500">
              Nessun account?{' '}
              <Link to="/registrazione" className="text-[#00FF41] hover:underline">REGISTRATI</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
