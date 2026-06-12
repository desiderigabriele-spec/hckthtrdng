import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Chat from './pages/Chat'
import Sfide from './pages/Sfide'
import SfidaLive from './pages/SfidaLive'
import Classifica from './pages/Classifica'
import Segnali from './pages/Segnali'
import Profilo from './pages/Profilo'
import Admin from './pages/Admin'
import LoadingTerminal from './components/ui/LoadingTerminal'

function PrivateOutlet({ requireVerified = false, requireAdmin = false }: {
  requireVerified?: boolean
  requireAdmin?: boolean
}) {
  const { session, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <LoadingTerminal lines={['> autenticazione in corso...', '> verifica sessione...']} />
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  if (requireAdmin && user?.ruolo !== 'admin') {
    return <Navigate to="/chat" replace />
  }

  if (requireVerified && user && !user.avatrade_verified) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="font-mono text-[#FFB800] space-y-2 mb-6">
            <p>{`> account in fase di verifica`}</p>
            <p className="text-xs text-gray-500">{`> attendi la verifica del team HTT`}</p>
          </div>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return <Outlet />
}

function AuthedRedirect({ children }: { children: React.ReactNode }) {
  const { session } = useAuth()
  if (session) return <Navigate to="/chat" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { session } = useAuth()

  return (
    <Routes>
      {/* Auth routes (no layout) */}
      <Route path="/login" element={<AuthedRedirect><Login /></AuthedRedirect>} />
      <Route path="/registrazione" element={<AuthedRedirect><Onboarding /></AuthedRedirect>} />

      {/* Routes with Layout */}
      <Route element={<Layout />}>
        {/* Public pages */}
        <Route path="/classifica" element={<Classifica />} />
        <Route path="/segnali" element={<Segnali />} />

        {/* Verified-only pages */}
        <Route element={<PrivateOutlet requireVerified />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/sfide" element={<Sfide />} />
          <Route path="/sfide/:id" element={<SfidaLive />} />
        </Route>

        {/* Logged-in pages */}
        <Route element={<PrivateOutlet />}>
          <Route path="/profilo" element={<Profilo />} />
        </Route>

        {/* Admin pages */}
        <Route element={<PrivateOutlet requireAdmin />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={session ? '/chat' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={session ? '/chat' : '/login'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
