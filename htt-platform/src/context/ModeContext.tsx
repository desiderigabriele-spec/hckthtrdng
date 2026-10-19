import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { COPY } from '../content/copy'
import type { Mode } from '../content/copy'

const KEY = 'landing-mode'

function readMode(): Mode | null {
  try {
    const v = sessionStorage.getItem(KEY)
    return v === 'neofita' || v === 'esperto' ? v : null
  } catch {
    return null
  }
}

interface ModeContextType {
  mode: Mode | null
  setMode: (m: Mode) => void
}

const ModeContext = createContext<ModeContextType>({ mode: null, setMode: () => {} })

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode | null>(readMode)
  const setMode = (m: Mode) => {
    setModeState(m)
    try { sessionStorage.setItem(KEY, m) } catch { /* storage non disponibile */ }
  }
  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMode = () => useContext(ModeContext)

// eslint-disable-next-line react-refresh/only-export-components
export const useCopy = () => COPY[useContext(ModeContext).mode ?? 'neofita']
