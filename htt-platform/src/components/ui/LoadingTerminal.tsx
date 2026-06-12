import { motion } from 'framer-motion'

interface LoadingTerminalProps {
  message?: string
}

export default function LoadingTerminal({ message = 'CARICAMENTO...' }: LoadingTerminalProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <motion.div
        className="text-[#00FF41] font-mono text-sm"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <span className="text-[#00FF41]">{'>'}</span> {message}
        <span className="animate-pulse ml-1">_</span>
      </motion.div>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-[#00FF41] rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  )
}
