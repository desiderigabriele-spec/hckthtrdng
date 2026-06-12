import { AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import MatrixRain from './MatrixRain'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'

export default function Layout() {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white relative overflow-hidden">
      <MatrixRain />
      <div className="relative z-10 flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 pb-16 md:pb-0 min-h-screen">
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
