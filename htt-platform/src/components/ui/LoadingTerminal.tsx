import { useEffect, useState } from 'react'

interface LoadingTerminalProps {
  lines?: string[]
  className?: string
}

const defaultLines = [
  '> Inizializzazione sistema...',
  '> Caricamento dati...',
  '> Connessione server...',
]

export default function LoadingTerminal({ lines = defaultLines, className = '' }: LoadingTerminalProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    setVisibleLines([])
    let index = 0
    const interval = setInterval(() => {
      if (index < lines.length) {
        setVisibleLines((prev) => [...prev, lines[index]])
        index++
      } else {
        clearInterval(interval)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [lines])

  useEffect(() => {
    const blink = setInterval(() => setCursor((c) => !c), 500)
    return () => clearInterval(blink)
  }, [])

  return (
    <div className={`font-mono text-sm text-[#00FF41] space-y-1 ${className}`}>
      {visibleLines.map((line, i) => (
        <div key={i} className="opacity-80">
          {line}
        </div>
      ))}
      <div>
        <span className="text-[#00FF41]">{'> '}</span>
        <span
          className={`inline-block w-2 h-4 bg-[#00FF41] transition-opacity duration-100 ${
            cursor ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  )
}
