import { CursorGlow, Marquee, ScrollProgress } from '../components/fx'
import MatrixRain from '../components/MatrixRain'
import { Hero, Nav } from '../sections/Hero'
import { Method, Problem } from '../sections/Story'
import { Compare, Proof, Team } from '../sections/Trust'
import { Faq, FinalCta, Footer, Packages, Process } from '../sections/Offer'

const TICKER = ['Zero errori', '4 conferme', 'Timeframe 15 minuti', 'Rischio 1% per operazione', 'XAU/USD', 'Profit Factor 3,5 in backtest', 'Supporto 24/7 a vita']

export default function Landing() {
  return (
    <div className="grain relative overflow-x-clip">
      <MatrixRain className="-z-10 opacity-[0.14]" />
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Marquee items={TICKER} />
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
  )
}
