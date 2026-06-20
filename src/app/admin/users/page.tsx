'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

type Streak = {
  currentStreak: number
  longestStreak: number
  lastRecordDate: string | null
}

type UserData = {
  id: string
  name: string
  email: string
  role: string
  credits: number
  createdAt: string
  readerCount: number
  childCount: number
  recordingCount: number
  streak: Streak | null
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [filtered, setFiltered] = useState<UserData[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      )
    )
  }, [search, users])

  async function loadData() {
    try {
      const me = await fetch('/api/auth/me')
      if (!me.ok) { router.push('/login'); return }
      const userData = await me.json()
      if (userData.role !== 'admin') { router.push('/dashboard'); return }
      setIsAdmin(true)

      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setUsers(data)
      setFiltered(data)
    } catch {
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  async function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (!res.ok) throw new Error()
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
      toast.success(`Usuário agora é ${newRole === 'admin' ? 'admin' : 'usuário'}`)
    } catch {
      toast.error('Erro ao alterar permissão')
    }
  }

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#FFE4D6] border-t-[#FF6B35] rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="page-container p-4 md:p-8 min-h-screen">
      <div className="bubble w-48 h-48 bg-[#A78BFA] opacity-5 top-0 right-[-8%]" />
      <div className="bubble w-32 h-32 bg-[#FFD93D] opacity-5 bottom-0 left-[-5%]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <Link
          href="/admin"
          className="navbar-link mb-6 inline-block"
        >
          ← Admin
        </Link>

        <div className="text-center mb-8">
          <span className="text-6xl block mb-4">👤</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
            Usuários
          </h1>
          <p className="text-[#A0897A] text-lg">
            {users.length} usuários cadastrados
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            placeholder="🔍 Buscar por nome ou email..."
          />
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card p-5"
              >
                <div
                  className="flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
                  onClick={() =>
                    setExpanded(expanded === user.id ? null : user.id)
                  }
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-[#4A3728] dark:text-[#E8E0D8] truncate">
                        {user.name}
                      </h3>
                      {user.role === 'admin' && (
                        <span className="badge-fun text-xs px-3 py-0.5">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#A0897A] truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-[#6B5744] dark:text-[#C4B8A8]">
                    <span>📖 {user.readerCount}</span>
                    <span>👶 {user.childCount}</span>
                    <span>🎧 {user.recordingCount}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleRole(user.id, user.role)
                    }}
                    className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${
                      user.role === 'admin'
                        ? 'bg-[#FFE4D6] text-[#FF6B35] hover:bg-[#FFD4C6]'
                        : 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]'
                    }`}
                  >
                    {user.role === 'admin' ? 'Remover admin' : 'Tornar admin'}
                  </button>
                </div>

                <AnimatePresence>
                  {expanded === user.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[#FFE4D6] mt-4 pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-[#A0897A] text-xs">Cadastro</p>
                          <p className="font-semibold text-[#4A3728] dark:text-[#E8E0D8]">
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#A0897A] text-xs">Créditos</p>
                          <p className="font-semibold text-[#4A3728] dark:text-[#E8E0D8]">
                            {user.credits}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#A0897A] text-xs">Streak atual</p>
                          <p className="font-semibold text-[#4A3728] dark:text-[#E8E0D8]">
                            {user.streak?.currentStreak ?? 0} dias
                          </p>
                        </div>
                        <div>
                          <p className="text-[#A0897A] text-xs">Maior streak</p>
                          <p className="font-semibold text-[#4A3728] dark:text-[#E8E0D8]">
                            {user.streak?.longestStreak ?? 0} dias
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-[#A0897A]">Nenhum usuário encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}
