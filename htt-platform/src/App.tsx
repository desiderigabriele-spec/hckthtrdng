import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { User } from './types'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Registrazione from './pages/Registrazione'
import Chat from './pages/Chat'
import Sfide from './pages/Sfide'
import SfidaLive from './pages/SfidaLive'
import Classifica from './pages/Classifica'
import Segnali from './pages/Segnali'
import Profilo from './pages/Profilo'
import Admin from './pages/Admin'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setUser(data)
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setUser(data))
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="font-mono text-[#00FF41] text-sm">
          <span className="animate-pulse">&gt; caricamento sistema...</span>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/chat" />} />
        <Route path="/registrazione" element={!user ? <Registrazione /> : <Navigate to="/chat" />} />
        <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} />} />
        <Route element={<Layout />}>
          <Route path="/chat" element={user ? <Chat user={user} /> : <Navigate to="/login" />} />
          <Route path="/sfide" element={user ? <Sfide user={user} /> : <Navigate to="/login" />} />
          <Route path="/sfide/:id" element={user ? <SfidaLive user={user} /> : <Navigate to="/login" />} />
          <Route path="/classifica" element={<Classifica user={user} />} />
          <Route path="/segnali" element={<Segnali user={user} />} />
          <Route path="/profilo" element={user ? <Profilo user={user} setUser={setUser} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.ruolo === 'admin' ? <Admin /> : <Navigate to="/chat" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
