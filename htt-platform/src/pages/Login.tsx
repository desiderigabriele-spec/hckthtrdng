import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Button from '../components/ui/Button'
import MatrixRain from '../components/layout/MatrixRain'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError
      navigate('/chat')
    } catch (err: any) {
      setError(err.message || 'Errore di accesso')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4 relative overflow-hidden">
      <MatrixRain />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.h1
            className="font-anton text-5xl text-[#00FF41] glow-green-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            HACK_THE
          </motion.h1>
          <motion.h1
            className="font-anton text-5xl text-[#00FF41] glow-green-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            TRADING
          </motion.h1>
          <motion.p
            className="text-gray-500 font-mono text-xs mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {'>'} accesso sistema richiesto
          </motion.p>
        </div>

        <motion.div
          className="bg-[#0D0D0D] border border-[#00FF41]/30 rounded-lg p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-[#00FF41] font-mono text-xs mb-4 opacity-60">
            // AUTENTICAZIONE TERMINALE
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">{'>'} EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-[#00FF41]/20 rounded px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00FF41] transition-colors"
                placeholder="trader@htt.io"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">{'>'} PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-[#00FF41]/20 rounded px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-[#00FF41] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#FF0033] text-xs font-mono bg-[#FF0033]/10 border border-[#FF0033]/30 rounded p-2"
              >
                {'>'} ERRORE: {error}
              </motion.div>
            )}

            <Button type="submit" loading={loading} fullWidth size="lg">
              {'>'} ACCEDI AL SISTEMA
            </Button>
          </form>

          <p className="text-center text-gray-500 text-xs font-mono mt-4">
            Nessun accesso?{' '}
            <Link to="/registrazione" className="text-[#00FF41] hover:underline">
              REGISTRATI
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
