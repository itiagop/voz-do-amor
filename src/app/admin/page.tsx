'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

type Stats = {
  users: number
  books: number
  readers: number
  childs: number
  recordings: number
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
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

      if (statsRes.ok) setStats(await statsRes.json())
      if (pixRes.ok) {
        const data = await pixRes.json()
        if (data.value) setPixKey(data.value)
      }
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
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#FFE4D6] border-t-[#FF6B35] rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="page-container p-4 md:p-8 min-h-screen">
      {/* Decorative bubbles */}
      <div className="bubble w-48 h-48 bg-[#A78BFA] opacity-5 top-0 right-[-8%]" />
      <div className="bubble w-32 h-32 bg-[#FFD93D] opacity-5 bottom-0 left-[-5%]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/dashboard" className="text-[#A0897A] hover:text-[#FF6B35] font-semibold mb-6 inline-block transition-colors">
          ← Painel
        </Link>

        <div className="text-center mb-10">
          <span className="text-6xl block mb-4">⚡</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
            Admin
          </h1>
          <p className="text-[#A0897A] text-lg">
            Gerencie o sistema e configure doações
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Usuários', value: stats?.users || 0, emoji: '👤', color: 'from-[#FF6B35] to-[#FF8C42]' },
            { label: 'Livros', value: stats?.books || 0, emoji: '📚', color: 'from-[#45B7D1] to-[#67E8F9]' },
            { label: 'Leitores', value: stats?.readers || 0, emoji: '🎙️', color: 'from-[#A78BFA] to-[#C4B5FD]' },
            { label: 'Crianças', value: stats?.childs || 0, emoji: '👶', color: 'from-[#FF6B9D] to-[#E8A0BF]' },
            { label: 'Gravações', value: stats?.recordings || 0, emoji: '🎧', color: 'from-[#51CF66] to-[#8CE99A]' },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4 text-center"
            >
              <span className="text-3xl block mb-2">{item.emoji}</span>
              <p className="text-2xl font-bold text-[#4A3728] dark:text-[#E8E0D8]">{item.value}</p>
              <p className="text-xs text-[#A0897A]">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Config PIX */}
        <div className="card p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">💛</span>
            <div>
              <h2 className="text-xl font-bold text-[#4A3728] dark:text-[#E8E0D8]">Doação PIX</h2>
              <p className="text-sm text-[#A0897A]">Configure a chave PIX para receber doações</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="input-label">Chave PIX (CPF, email, telefone ou aleatória)</label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="input-field"
                placeholder="Ex: 000.000.000-00 ou pix@email.com"
              />
            </div>
            <button
              onClick={savePixKey}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? '⏳ Salvando...' : '💛 Salvar chave PIX'}
            </button>
          </div>
        </div>

        {/* Quick info */}
        <div className="card p-6">
          <h3 className="font-bold text-[#4A3728] dark:text-[#E8E0D8] mb-3">📋 Resumo do sistema</h3>
          <div className="space-y-2 text-sm text-[#6B5744] dark:text-[#C4B8A8]">
            <p>✅ Sistema rodando com {stats?.books} livros disponíveis</p>
            <p>✅ {stats?.users} usuários cadastrados</p>
            <p>✅ {stats?.recordings} gravações feitas com amor</p>
            <p className="text-xs text-[#A0897A] mt-2">💛 Voz Que Fica — A voz de quem ama, pra sempre</p>
          </div>
        </div>
      </div>
    </div>
  )
}
