import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Accedi from './pages/Accedi'
import Area from './pages/Area'

function Splash() {
  return (
    <div className="grid min-h-[100svh] place-items-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-neon/20 border-t-neon" />
    </div>
  )
}

function Protected({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <Splash />
  if (!session) return <Navigate to="/accedi" replace />
  return <>{children}</>
}

function GuestOnly({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <Splash />
  if (session) return <Navigate to="/area" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/accedi" element={<GuestOnly><Accedi /></GuestOnly>} />
          <Route path="/area" element={<Protected><Area /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
