'use client'

import { useTheme } from './theme-provider'
import { motion } from 'framer-motion'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 hover:scale-110 ${className}`}
      title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
    >
      <motion.span
        key={theme}
        initial={{ y: -20, opacity: 0, rotate: -90 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: 20, opacity: 0, rotate: 90 }}
        transition={{ duration: 0.2 }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </motion.span>
    </button>
  )
}
