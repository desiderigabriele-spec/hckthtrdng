import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'amber'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-[#00FF41]/10 border border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41]/20 shadow-[0_0_10px_rgba(0,255,65,0.3)]',
    secondary: 'bg-transparent border border-gray-600 text-gray-300 hover:border-gray-400',
    danger: 'bg-[#FF0033]/10 border border-[#FF0033] text-[#FF0033] hover:bg-[#FF0033]/20',
    amber: 'bg-[#FFB800]/10 border border-[#FFB800] text-[#FFB800] hover:bg-[#FFB800]/20',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        font-mono font-medium rounded transition-all
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={loading || props.disabled}
      {...(props as any)}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="animate-spin">⠋</span>
          <span>ELABORAZIONE...</span>
        </span>
      ) : children}
    </motion.button>
  )
}
