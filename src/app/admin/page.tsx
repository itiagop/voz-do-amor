'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

type Stats = {
  users: number
  books: number
  readers: number
  recordings: number
  donations: number
  revenue: number
  recentUsers: UserItem[]
  recentRecordings: RecordingItem[]
}

type UserItem = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  readers: number
  childs: number
  recordings: number
}

type RecordingItem = {
  id: string
  title: string
  status: string
  createdAt: string
  book: { title: string }
  reader: { name: string }
  child: { name: string }
}

type Donation = {
  id: string
  amount: number
  donorName: string
  donorEmail: string
  message: string | null
  status: string
  createdAt: string
}

type TabName = 'visao-geral' | 'usuarios' | 'gravacoes' | 'doacoes'

const tabs: { id: TabName; label: string; emoji: string }[] = [
  { id: 'visao-geral', label: 'Visão Geral', emoji: '📊' },
  { id: 'usuarios', label: 'Usuários Recentes', emoji: '👥' },
  { id: 'gravacoes', label: 'Últimas Gravações', emoji: '🎧' },
  { id: 'doacoes', label: 'Doações Recentes', emoji: '💛' },
]

const statCards = [
  { label: 'Usuários', key: 'users' as const, emoji: '👥', gradient: 'from-[#FF6B35] via-[#FF8C42] to-[#FFB088]' },
  { label: 'Livros', key: 'books' as const, emoji: '📚', gradient: 'from-[#45B7D1] via-[#67E8F9] to-[#A5F3FC]' },
  { label: 'Leitores', key: 'readers' as const, emoji: '🎙️', gradient: 'from-[#A78BFA] via-[#C4B5FD] to-[#DDD6FE]' },
  { label: 'Gravações', key: 'recordings' as const, emoji: '🎧', gradient: 'from-[#51CF66] via-[#8CE99A] to-[#B2F2BB]' },
  { label: 'Doações', key: 'donations' as const, emoji: '💛', gradient: 'from-[#FFD93D] via-[#FFE066] to-[#FFF3BF]' },
  { label: 'Receita', key: 'revenue' as const, emoji: '💰', gradient: 'from-[#FF6B9D] via-[#FF8CB3] to-[#FFB3CC]' },
]

const quickActions = [
  { href: '/admin/users', label: '👥 Admin Usuários', color: 'from-[#FF6B35] to-[#FF8C42]' },
  { href: '/admin/recordings', label: '🎧 Revisar Gravações', color: 'from-[#A78BFA] to-[#C4B5FD]' },
  { href: '/admin/donations', label: '💛 Doações', color: 'from-[#FFD93D] to-[#FFE066]' },
  { href: '/books/create', label: '📚 Criar Livro', color: 'from-[#45B7D1] to-[#67E8F9]' },
]

function getBadgeClass(role: string) {
  if (role === 'admin') return 'badge-sun'
  if (role === 'reader') return 'badge-ocean'
  return 'badge-fun'
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'approved': return <span className="badge-fun text-xs">✔ Aprovado</span>
    case 'pending': return <span className="badge-sun text-xs">⏳ Pendente</span>
    case 'rejected': return <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">✖ Rejeitado</span>
    default: return <span className="badge-ocean text-xs">{status}</span>
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabName>('visao-geral')
  const [stats, setStats] = useState<Stats | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [pixKey, setPixKey] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const me = await fetch('/api/auth/me')
      if (!me.ok) { router.push('/login'); return }
      const userData = await me.json()
      if (userData.role !== 'admin') { router.push('/dashboard'); return }
      setIsAdmin(true)

      const [statsRes, pixRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/settings?key=pix_key'),
      ])

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }

      if (pixRes.ok) {
        const data = await pixRes.json()
        if (data.value) setPixKey(data.value)
      }

      const donRes = await fetch('/api/donations/admin')
      if (donRes.ok) setDonations(await donRes.json())
    } catch {
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  async function savePixKey() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'pix_key', value: pixKey }),
      })
      if (!res.ok) throw new Error()
      toast.success('Chave PIX salva! 💛')
    } catch {
      toast.error('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#FFE4D6] border-t-[#FF6B35] rounded-full animate-spin" />
            <div className="absolute inset-2 border-4 border-[#FFE4D6] border-t-[#A78BFA] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          </div>
          <p className="text-gradient font-bold text-xl">Carregando painel...</p>
        </motion.div>
      </div>
    )
  }

  if (!isAdmin) return null

  const recentUsers = stats?.recentUsers?.slice(0, 5) ?? []
  const recentRecordings = stats?.recentRecordings?.slice(0, 5) ?? []
  const recentDonations = donations.slice(0, 5)

  return (
    <div className="page-container p-4 md:p-8 min-h-screen">
      <div className="bubble w-56 h-56 bg-[#A78BFA] opacity-5 top-0 right-[-8%]" style={{ animationDelay: '0s' }} />
      <div className="bubble w-40 h-40 bg-[#FFD93D] opacity-5 bottom-[20%] left-[-6%]" style={{ animationDelay: '1.5s' }} />
      <div className="bubble w-32 h-32 bg-[#45B7D1] opacity-5 top-[40%] right-[-4%]" style={{ animationDelay: '3s' }} />
      <div className="bubble w-24 h-24 bg-[#FF6B9D] opacity-5 bottom-0 left-[30%]" style={{ animationDelay: '2s' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#A0897A] hover:text-[#FF6B35] font-semibold mb-6 transition-all duration-300 hover:gap-3"
        >
          ← Painel
        </Link>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12 }}
            className="text-6xl block mb-4"
          >
            ⚡
          </motion.span>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">
            Admin Dashboard
          </h1>
          <p className="text-[#A0897A] dark:text-[#8A7E70] text-lg">
            Gerencie o sistema com poder e estilo
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF6B9D] text-white shadow-lg shadow-[#FF6B35]/30'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-light)] hover:border-[#FF6B35]/30 hover:shadow-md'
              }`}
            >
              {tab.emoji} {tab.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'visao-geral' && (
            <motion.div
              key="visao-geral"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {statCards.map((item, i) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, type: 'spring', stiffness: 120 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="card p-5 text-center relative overflow-hidden group cursor-default"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.07 + 0.2, type: 'spring', stiffness: 200 }}
                      className="text-3xl block mb-2"
                    >
                      {item.emoji}
                    </motion.span>
                    <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                      {item.key === 'revenue'
                        ? formatCurrency(stats?.revenue ?? 0)
                        : (stats?.[item.key] ?? 0)}
                    </p>
                    <p className="text-xs text-[#A0897A] dark:text-[#8A7E70] mt-1 font-medium">{item.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <h2 className="section-title text-xl mb-5">⚡ Ações Rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickActions.map((action, i) => (
                    <motion.div
                      key={action.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <Link
                        href={action.href}
                        className="card p-4 flex items-center gap-3 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform`}>
                          {action.label.split(' ')[0]}
                        </div>
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                          {action.label.slice(action.label.indexOf(' ') + 1)}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* System Status + PIX Config */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="card p-6"
                >
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">📋 Status do Sistema</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Servidor', status: 'online', color: '#51CF66' },
                      { label: 'Banco de Dados', status: 'conectado', color: '#51CF66' },
                      { label: 'API', status: 'rodando', color: '#51CF66' },
                      { label: 'Último deploy', status: 'hoje', color: '#45B7D1' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-[var(--border-light)] last:border-0">
                        <span className="text-sm font-medium text-[var(--text-secondary)]">{item.label}</span>
                        <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: item.color }}>
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--border-light)]">
                    <p className="text-xs text-[#A0897A]">
                      💛 Voz Que Fica — {stats?.books ?? 0} livros, {stats?.users ?? 0} usuários, {stats?.recordings ?? 0} gravações
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="card p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">💛</span>
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">Doação PIX</h3>
                      <p className="text-xs text-[#A0897A]">Configure a chave PIX</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      className="input-field text-sm"
                      placeholder="Ex: 000.000.000-00 ou pix@email.com"
                    />
                    <button
                      onClick={savePixKey}
                      disabled={saving}
                      className="btn-primary w-full text-sm py-3"
                    >
                      {saving ? '⏳ Salvando...' : '💛 Salvar chave PIX'}
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'usuarios' && (
            <motion.div
              key="usuarios"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="section-title text-xl mb-6">👥 Usuários Recentes</h2>
              {recentUsers.length === 0 ? (
                <div className="card p-12 text-center">
                  <span className="text-5xl block mb-4">👥</span>
                  <p className="text-[#A0897A] font-medium">Nenhum usuário encontrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentUsers.map((user, i) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#A78BFA] flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">{user.name}</p>
                          <p className="text-xs text-[#A0897A]">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={getBadgeClass(user.role)}>
                          {user.role}
                        </span>
                        <span className="text-xs text-[#A0897A] whitespace-nowrap">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'gravacoes' && (
            <motion.div
              key="gravacoes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="section-title text-xl mb-6">🎧 Últimas Gravações</h2>
              {recentRecordings.length === 0 ? (
                <div className="card p-12 text-center">
                  <span className="text-5xl block mb-4">🎧</span>
                  <p className="text-[#A0897A] font-medium">Nenhuma gravação encontrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRecordings.map((rec, i) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#51CF66] to-[#8CE99A] flex items-center justify-center text-white text-lg shadow-md">
                          🎧
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">{rec.book?.title ?? 'Sem título'}</p>
                          <p className="text-xs text-[#A0897A]">
                            {rec.reader?.name ?? 'Leitor desconhecido'} — {rec.child?.name ?? ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(rec.status)}
                        <span className="text-xs text-[#A0897A] whitespace-nowrap">
                          {formatDate(rec.createdAt)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'doacoes' && (
            <motion.div
              key="doacoes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title text-xl">💛 Doações Recentes</h2>
                {donations.length > 0 && (
                  <div className="text-sm bg-gradient-to-r from-[#FFD93D] to-[#FFE066] text-[#4A3728] font-bold px-4 py-2 rounded-full shadow-md">
                    Total: {formatCurrency(donations.reduce((s, d) => s + d.amount, 0))}
                  </div>
                )}
              </div>
              {recentDonations.length === 0 ? (
                <div className="card p-12 text-center">
                  <span className="text-5xl block mb-4">💛</span>
                  <p className="text-[#A0897A] font-medium">Nenhuma doação recebida ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentDonations.map((don, i) => (
                    <motion.div
                      key={don.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FFD93D] to-[#FFB347] flex items-center justify-center text-[#4A3728] text-lg shadow-md font-bold">
                          R$
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">
                            {formatCurrency(don.amount)}
                          </p>
                          <p className="text-xs text-[#A0897A]">
                            {don.donorName || 'Anônimo'}
                            {don.message && <span> — "{don.message}"</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(don.status)}
                        <span className="text-xs text-[#A0897A] whitespace-nowrap">
                          {formatDate(don.createdAt)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
