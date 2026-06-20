'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

type Donation = {
  id: string
  amount: number
  method: string
  donorName: string | null
  donorEmail: string | null
  message: string | null
  status: string
  paidAt: string | null
  createdAt: string
  user: { id: string; name: string; email: string } | null
}

const TABS = [
  { label: 'Todas', value: '' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Confirmadas', value: 'confirmed' },
]

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-[#FFF3E0] text-[#E65100]',
  confirmed: 'bg-[#E8F5E9] text-[#2E7D32]',
  cancelled: 'bg-[#FFEBEE] text-[#C62828]',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
}

export default function AdminDonationsPage() {
  const router = useRouter()
  const [donations, setDonations] = useState<Donation[]>([])
  const [filtered, setFiltered] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (activeTab) {
      setFiltered(donations.filter((d) => d.status === activeTab))
    } else {
      setFiltered(donations)
    }
  }, [activeTab, donations])

  async function loadData() {
    try {
      const me = await fetch('/api/auth/me')
      if (!me.ok) { router.push('/login'); return }
      const userData = await me.json()
      if (userData.role !== 'admin') { router.push('/dashboard'); return }
      setIsAdmin(true)

      const res = await fetch('/api/donations/admin')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setDonations(data)
      setFiltered(data)
    } catch {
      toast.error('Erro ao carregar doações')
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = filtered.reduce((sum, d) => sum + d.amount, 0)
  const totalAll = donations.reduce((sum, d) => sum + d.amount, 0)

  function formatMoney(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
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

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/admin" className="navbar-link mb-6 inline-block">
          ← Admin
        </Link>

        <div className="text-center mb-8">
          <span className="text-6xl block mb-4">💛</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
            Doações
          </h1>
          <p className="text-[#A0897A] text-lg">
            Acompanhe as doações recebidas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-5 text-center"
          >
            <p className="text-3xl font-bold text-[#4A3728] dark:text-[#E8E0D8]">
              {formatMoney(totalAll)}
            </p>
            <p className="text-xs text-[#A0897A]">Total geral</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card p-5 text-center"
          >
            <p className="text-3xl font-bold text-[#4A3728] dark:text-[#E8E0D8]">
              {donations.length}
            </p>
            <p className="text-xs text-[#A0897A]">Total de doações</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-5 text-center"
          >
            <p className="text-3xl font-bold text-[#2E7D32]">
              {donations.filter((d) => d.status === 'confirmed').length}
            </p>
            <p className="text-xs text-[#A0897A]">Confirmadas ✅</p>
          </motion.div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === tab.value
                  ? 'bg-[#FF6B35] text-white shadow-md'
                  : 'bg-[#FFE4D6] text-[#6B5744] hover:bg-[#FFD4C6]'
              }`}
            >
              {tab.label}{' '}
              {tab.value
                ? `(${donations.filter((d) => d.status === tab.value).length})`
                : `(${donations.length})`}
            </button>
          ))}
        </div>

        {activeTab && (
          <div className="text-center mb-4">
            <span className="text-lg font-bold text-[#4A3728] dark:text-[#E8E0D8]">
              Filtro: {formatMoney(totalAmount)}
            </span>
          </div>
        )}

        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((donation, i) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {donation.status === 'confirmed' ? '✅' : '⏳'}
                      </span>
                      <div>
                        <p className="font-bold text-lg text-[#4A3728] dark:text-[#E8E0D8]">
                          {formatMoney(donation.amount)}
                        </p>
                        <p className="text-sm text-[#A0897A]">
                          {donation.donorName || donation.user?.name || 'Anônimo'}
                          {donation.donorName && donation.donorEmail
                            ? ` — ${donation.donorEmail}`
                            : ''}
                        </p>
                      </div>
                    </div>
                    {donation.message && (
                      <p className="text-sm text-[#6B5744] dark:text-[#C4B8A8] mt-2 italic">
                        &ldquo;{donation.message}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm shrink-0">
                    <div className="text-right">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          STATUS_COLORS[donation.status] || 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {STATUS_LABELS[donation.status] || donation.status}
                      </span>
                      <p className="text-xs text-[#A0897A] mt-1">
                        {new Date(donation.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">💛</span>
            <p className="text-[#A0897A]">Nenhuma doação encontrada</p>
          </div>
        )}
      </div>
    </div>
  )
}
