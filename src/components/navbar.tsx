'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUserStore } from '@/lib/store'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  const { user, setUser } = useUserStore()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!user) {
      fetch('/api/auth/me', { credentials: 'include' })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data?.id) setUser({ id: data.id, name: data.name, email: data.email, role: data.role })
        })
        .catch(() => {})
        .finally(() => setChecked(true))
    } else {
      setChecked(true)
    }
  }, [])

  return (
    <nav className="navbar">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-3xl group-hover:scale-110 transition-transform duration-300 inline-block">📚</span>
          <span className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] via-[#FF6B9D] to-[#A78BFA] bg-clip-text text-transparent">
            Voz Que Fica
          </span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/dashboard" className="navbar-link">
            Início
          </Link>
          <Link href="/books" className="navbar-link">
            Livros
          </Link>
          <Link href="/donate" className="navbar-link">
            💛 Doar
          </Link>
          <ThemeToggle />
          {user && checked ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[#A0897A] text-xs">
                {user.name?.split(' ')[0]}
              </span>
              <Link href="/dashboard" className="bg-gradient-to-r from-[#A78BFA] to-[#C4B5FD] text-white font-bold px-5 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                Dashboard
              </Link>
            </div>
          ) : (
            <Link href="/login" className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white font-bold px-5 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
