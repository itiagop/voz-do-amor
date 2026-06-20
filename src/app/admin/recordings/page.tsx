'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

type RecordingData = {
  id: string
  status: string
  createdAt: string
  reader: { id: string; name: string }
  child: { id: string; name: string } | null
  book: { id: string; title: string }
  _count: { pages: number }
}

type RecordingDetail = RecordingData & {
  pages: { id: string; pageNumber: number; audioUrl: string | null; duration: number }[]
}

const TABS = [
  { label: 'Todas', value: '' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Aprovadas', value: 'approved' },
  { label: 'Rejeitadas', value: 'rejected' },
]

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  pending: 'bg-[#FFF3E0] text-[#E65100]',
  approved: 'bg-[#E8F5E9] text-[#2E7D32]',
  rejected: 'bg-[#FFEBEE] text-[#C62828]',
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Rascunho',
  pending: 'Pendente',
  approved: 'Aprovada',
  rejected: 'Rejeitada',
}

export default function AdminRecordingsPage() {
  const router = useRouter()
  const [recordings, setRecordings] = useState<RecordingData[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<RecordingDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

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

      await fetchRecordings()
    } catch {
      toast.error('Erro ao carregar gravações')
    } finally {
      setLoading(false)
    }
  }

  async function fetchRecordings(status?: string) {
    try {
      const url = status
        ? `/api/admin/recordings?status=${status}`
        : '/api/admin/recordings'
      const res = await fetch(url)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setRecordings(data)
    } catch {
      toast.error('Erro ao carregar gravações')
    }
  }

  async function switchTab(tab: string) {
    setActiveTab(tab)
    setSelectedId(null)
    setDetail(null)
    await fetchRecordings(tab || undefined)
  }

  async function openDetail(id: string) {
    setSelectedId(id)
    setDetailLoading(true)
    setDetail(null)
    try {
      const res = await fetch(`/api/recordings/${id}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setDetail(data)
    } catch {
      toast.error('Erro ao carregar detalhes')
    } finally {
      setDetailLoading(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/recordings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setRecordings((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )
      if (detail && detail.id === id) {
        setDetail({ ...detail, ...updated, pages: updated.pages ?? detail.pages })
      }
      const msgs: Record<string, string> = {
        approved: 'Gravação aprovada! ✅',
        rejected: 'Gravação rejeitada',
        pending: 'Gravação pendente novamente',
      }
      toast.success(msgs[status] || 'Status atualizado')
    } catch {
      toast.error('Erro ao atualizar status')
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
        <Link href="/admin" className="navbar-link mb-6 inline-block">
          ← Admin
        </Link>

        <div className="text-center mb-8">
          <span className="text-6xl block mb-4">🎧</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
            Gravações
          </h1>
          <p className="text-[#A0897A] text-lg">
            Revise e gerencie as gravações
          </p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => switchTab(tab.value)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === tab.value
                  ? 'bg-[#FF6B35] text-white shadow-md'
                  : 'bg-[#FFE4D6] text-[#6B5744] hover:bg-[#FFD4C6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence>
            {recordings.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`card p-5 cursor-pointer transition-all ${
                  selectedId === rec.id ? 'ring-2 ring-[#FF6B35]' : ''
                }`}
                onClick={() => openDetail(rec.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-[#4A3728] dark:text-[#E8E0D8] truncate flex-1">
                    📖 {rec.book.title}
                  </h3>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ml-2 ${
                      STATUS_COLORS[rec.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {STATUS_LABELS[rec.status] || rec.status}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-[#6B5744] dark:text-[#C4B8A8]">
                  <p>🎙️ {rec.reader.name}</p>
                  {rec.child && <p>👶 {rec.child.name}</p>}
                  <p>📄 {rec._count.pages} páginas</p>
                </div>

                <p className="text-xs text-[#A0897A] mt-3">
                  {new Date(rec.createdAt).toLocaleDateString('pt-BR')}
                </p>

                <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                  {rec.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus(rec.id, 'approved')}
                      className="flex-1 text-xs font-bold py-2 rounded-full bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] transition-all"
                    >
                      ✅ Aprovar
                    </button>
                  )}
                  {rec.status !== 'rejected' && (
                    <button
                      onClick={() => updateStatus(rec.id, 'rejected')}
                      className="flex-1 text-xs font-bold py-2 rounded-full bg-[#FFEBEE] text-[#C62828] hover:bg-[#FFCDD2] transition-all"
                    >
                      ❌ Rejeitar
                    </button>
                  )}
                  {rec.status !== 'pending' && (
                    <button
                      onClick={() => updateStatus(rec.id, 'pending')}
                      className="flex-1 text-xs font-bold py-2 rounded-full bg-[#FFF3E0] text-[#E65100] hover:bg-[#FFE0B2] transition-all"
                    >
                      ↩️ Pendente
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {recordings.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">🎧</span>
            <p className="text-[#A0897A]">Nenhuma gravação encontrada</p>
          </div>
        )}

        <AnimatePresence>
          {selectedId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
              onClick={() => {
                setSelectedId(null)
                setDetail(null)
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="card p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#4A3728] dark:text-[#E8E0D8]">
                    Detalhes da gravação
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedId(null)
                      setDetail(null)
                    }}
                    className="text-[#A0897A] hover:text-[#FF6B35] text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {detailLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-[#FFE4D6] border-t-[#FF6B35] rounded-full animate-spin" />
                  </div>
                ) : detail ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[#A0897A] text-xs">Livro</p>
                        <p className="font-semibold text-[#4A3728] dark:text-[#E8E0D8]">
                          {detail.book.title}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#A0897A] text-xs">Leitor</p>
                        <p className="font-semibold text-[#4A3728] dark:text-[#E8E0D8]">
                          {detail.reader.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#A0897A] text-xs">Criança</p>
                        <p className="font-semibold text-[#4A3728] dark:text-[#E8E0D8]">
                          {detail.child?.name || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#A0897A] text-xs">Status</p>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            STATUS_COLORS[detail.status] || 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {STATUS_LABELS[detail.status] || detail.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-[#A0897A] text-xs">Data</p>
                        <p className="font-semibold text-[#4A3728] dark:text-[#E8E0D8]">
                          {new Date(detail.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#A0897A] text-xs">Total de páginas</p>
                        <p className="font-semibold text-[#4A3728] dark:text-[#E8E0D8]">
                          {detail.pages.length}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-[#FFE4D6] pt-4">
                      <h3 className="font-bold text-[#4A3728] dark:text-[#E8E0D8] mb-3">
                        🎵 Páginas gravadas
                      </h3>
                      <div className="space-y-3">
                        {detail.pages.map((page) => (
                          <div
                            key={page.id}
                            className="bg-[#FFF5F0] dark:bg-[#1A1A2E] rounded-xl p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-sm text-[#4A3728] dark:text-[#E8E0D8]">
                                Página {page.pageNumber}
                              </span>
                              {page.duration > 0 && (
                                <span className="text-xs text-[#A0897A]">
                                  {page.duration.toFixed(1)}s
                                </span>
                              )}
                            </div>
                            {page.audioUrl ? (
                              <audio
                                controls
                                className="w-full h-10"
                                src={page.audioUrl}
                                preload="none"
                              >
                                Seu navegador não suporta áudio
                              </audio>
                            ) : (
                              <p className="text-xs text-[#A0897A] italic">
                                Áudio ainda não gravado
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {detail.status !== 'approved' && (
                        <button
                          onClick={() => updateStatus(detail.id, 'approved')}
                          className="btn-primary flex-1 text-sm py-3"
                        >
                          ✅ Aprovar
                        </button>
                      )}
                      {detail.status !== 'rejected' && (
                        <button
                          onClick={() => updateStatus(detail.id, 'rejected')}
                          className="btn-secondary flex-1 text-sm py-3"
                        >
                          ❌ Rejeitar
                        </button>
                      )}
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
