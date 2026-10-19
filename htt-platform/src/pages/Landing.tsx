import { AnimatePresence } from 'framer-motion'
import { CursorGlow, Marquee, ScrollProgress } from '../components/fx'
import MatrixRain from '../components/MatrixRain'
import PillGate from '../components/PillGate'
import { useCopy, useMode } from '../context/ModeContext'
import { Hero, Nav } from '../sections/Hero'
import { Method, Problem } from '../sections/Story'
import { Compare, Proof, Team } from '../sections/Trust'
import { Faq, FinalCta, Footer, Packages, Process } from '../sections/Offer'

export default function Landing() {
  const { mode, setMode } = useMode()
  const copy = useCopy()

  return (
    <>
      <AnimatePresence>{!mode && <PillGate key="gate" onChoose={setMode} />}</AnimatePresence>
      {mode && (
        <div key={mode} className="grain relative overflow-x-clip">
          <MatrixRain className="-z-10 opacity-[0.14]" />
          <ScrollProgress />
          <CursorGlow />
          <Nav />
          <main>
            <Hero />
            <Marquee items={copy.ticker} />
            <Problem />
            <Method />
            <Proof />
            <Compare />
            <Team />
            <Packages />
            <Process />
            <Faq />
            <FinalCta />
          </main>
          <Footer />
        </div>
      )}
    </>
  )
}
