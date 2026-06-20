'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useUserStore } from '@/lib/store'
import { getAvatarColor, getInitials } from '@/lib/utils'

type Reader = {
  id: string
  name: string
  avatar: string | null
  relation: string | null
  recordings: any[]
}

type Child = {
  id: string
  name: string
  avatar: string | null
  age: number | null
  color: string
  recordings: any[]
}

type UserData = {
  id: string
  name: string
  email: string
  role?: string
  readers: Reader[]
  childs: Child[]
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, setUser } = useUserStore()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReaderModal, setShowReaderModal] = useState(false)
  const [showChildModal, setShowChildModal] = useState(false)
  const [newReaderName, setNewReaderName] = useState('')
  const [newReaderRelation, setNewReaderRelation] = useState('')
  const [newChildName, setNewChildName] = useState('')
  const [newChildAge, setNewChildAge] = useState('')

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setUserData(data)
      setUser({ id: data.id, name: data.name, email: data.email })
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  async function addReader() {
    if (!newReaderName.trim()) return
    try {
      const res = await fetch('/api/readers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newReaderName, relation: newReaderRelation }),
      })
      if (!res.ok) throw new Error()
      toast.success(`✨ ${newReaderName} foi adicionado(a)!`)
      setNewReaderName('')
      setNewReaderRelation('')
      setShowReaderModal(false)
      loadUserData()
    } catch {
      toast.error('Erro ao adicionar leitor')
    }
  }

  async function addChild() {
    if (!newChildName.trim()) return
    try {
      const res = await fetch('/api/childs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newChildName, age: newChildAge }),
      })
      if (!res.ok) throw new Error()
      toast.success(`🌟 ${newChildName} foi adicionado(a)!`)
      setNewChildName('')
      setNewChildAge('')
      setShowChildModal(false)
      loadUserData()
    } catch {
      toast.error('Erro ao adicionar criança')
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFE4D6] border-t-[#FF6B35] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#A0897A] text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container p-4 md:p-8">
      {/* Decorative bubbles */}
      <div className="bubble w-40 h-40 bg-[#FF6B35] opacity-10 top-0 left-[-5%]" style={{ animationDelay: '0s' }} />
      <div className="bubble w-28 h-28 bg-[#45B7D1] opacity-10 top-[20%] right-[-3%]" style={{ animationDelay: '1s' }} />
      <div className="bubble w-20 h-20 bg-[#A78BFA] opacity-10 top-[40%] left-[-2%]" style={{ animationDelay: '2s' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient-warm">
                Olá, {user?.name?.split(' ')[0]}! <span className="float-emoji">👋</span>
              </h1>
              <p className="text-[#A0897A] mt-1 text-lg">
                Aqui você cria histórias que ficam pra sempre
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user?.role === 'admin' && (
                <Link href="/admin" className="badge-sun hover:scale-105 transition-transform">
                  ⚡ Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-[#A0897A] hover:text-[#FF6B35] transition-colors text-sm font-semibold"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-12">
          {/* Leitores */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#4A3728]">
                  🎙️ Quem vai ler?
                </h2>
                <p className="text-[#A0897A]">Adicione quem vai gravar a voz</p>
              </div>
              <button
                onClick={() => setShowReaderModal(true)}
                className="btn-primary text-sm py-3 px-6"
              >
                + Adicionar
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userData?.readers.map((reader) => (
                <div key={reader.id} className="card-fun p-5 text-center group">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-md"
                    style={{ backgroundColor: getAvatarColor(reader.name) }}
                  >
                    {getInitials(reader.name)}
                  </div>
                  <h3 className="font-bold text-[#4A3728]">{reader.name}</h3>
                  {reader.relation && (
                    <p className="text-sm text-[#A0897A]">{reader.relation}</p>
                  )}
                  <div className="mt-3 inline-block bg-[#FFF5F0] rounded-full px-3 py-1">
                    <span className="text-xs font-semibold text-[#FF6B35]">
                      {reader.recordings.length} {reader.recordings.length === 1 ? 'história' : 'histórias'} 📚
                    </span>
                  </div>
                </div>
              ))}

              {(!userData?.readers || userData.readers.length === 0) && (
                <div className="col-span-full text-center py-12 bg-white/60 backdrop-blur rounded-[2rem] border-2 border-dashed border-[#FFD4C6]">
                  <span className="text-5xl block mb-4">🎙️</span>
                  <p className="text-[#FF6B35] text-lg font-bold mb-2">Nenhum leitor ainda</p>
                  <p className="text-[#A0897A]">Adicione quem vai ler as histórias com carinho</p>
                </div>
              )}
            </div>
          </section>

          {/* Crianças */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#4A3728]">
                  👶 Quem vai ouvir?
                </h2>
                <p className="text-[#A0897A]">Adicione as crianças que vão receber as histórias</p>
              </div>
              <button
                onClick={() => setShowChildModal(true)}
                className="btn-secondary text-sm py-3 px-6"
              >
                + Adicionar
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userData?.childs.map((child) => (
                <Link
                  key={child.id}
                  href={`/listen/${child.id}`}
                  className="card-fun p-5 text-center group"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold group-hover:scale-110 transition-transform duration-300 shadow-md"
                    style={{ backgroundColor: child.color }}
                  >
                    {getInitials(child.name)}
                  </div>
                  <h3 className="font-bold text-[#4A3728]">{child.name}</h3>
                  {child.age && (
                    <p className="text-sm text-[#A0897A]">{child.age} anos</p>
                  )}
                  <div className="mt-3 inline-block bg-[#F0F8FF] rounded-full px-3 py-1">
                    <span className="text-xs font-semibold text-[#45B7D1]">
                      {child.recordings.length} {child.recordings.length === 1 ? 'história' : 'histórias'} 🎧
                    </span>
                  </div>
                </Link>
              ))}

              {(!userData?.childs || userData.childs.length === 0) && (
                <div className="col-span-full text-center py-12 bg-white/60 backdrop-blur rounded-[2rem] border-2 border-dashed border-[#B8E6F3]">
                  <span className="text-5xl block mb-4">👶</span>
                  <p className="text-[#45B7D1] text-lg font-bold mb-2">Nenhuma criança ainda</p>
                  <p className="text-[#A0897A]">Adicione quem vai ouvir as histórias</p>
                </div>
              )}
            </div>
          </section>

          {/* Biblioteca */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#4A3728]">
                  📚 Biblioteca
                </h2>
                <p className="text-[#A0897A]">Escolha um livro pra gravar</p>
              </div>
              <Link href="/books" className="btn-outline text-sm py-3 px-6">
                Ver todos
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/books"
                className="card-fun p-6 text-center flex flex-col items-center justify-center min-h-[200px] group"
              >
                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">📚</span>
                <span className="text-[#4A3728] font-bold text-lg">Explorar livros</span>
                <span className="text-sm text-[#A0897A] mt-1">Escolha um pra começar</span>
                <div className="mt-4 w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF6B9D] flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 transition-transform">
                  →
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Modal Leitor */}
      {showReaderModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowReaderModal(false)}>
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-[#FFE4D6]" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <span className="text-5xl block mb-3">🎙️</span>
              <h3 className="text-2xl font-bold text-[#4A3728]">Adicionar Leitor</h3>
              <p className="text-[#A0897A] text-sm mt-1">Quem vai gravar as histórias?</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="input-label">Nome</label>
                <input
                  type="text"
                  value={newReaderName}
                  onChange={(e) => setNewReaderName(e.target.value)}
                  className="input-field"
                  placeholder="Ex: Vovó Maria"
                />
              </div>
              <div>
                <label className="input-label">Parentesco (opcional)</label>
                <input
                  type="text"
                  value={newReaderRelation}
                  onChange={(e) => setNewReaderRelation(e.target.value)}
                  className="input-field"
                  placeholder="Ex: Avó, Pai, Tia"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowReaderModal(false)} className="btn-outline flex-1 py-3">
                  Cancelar
                </button>
                <button onClick={addReader} className="btn-primary flex-1 py-3">
                  ✨ Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criança */}
      {showChildModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowChildModal(false)}>
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-[#B8E6F3]" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <span className="text-5xl block mb-3">👶</span>
              <h3 className="text-2xl font-bold text-[#4A3728]">Adicionar Criança</h3>
              <p className="text-[#A0897A] text-sm mt-1">Quem vai ouvir as histórias?</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="input-label">Nome</label>
                <input
                  type="text"
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  className="input-field"
                  placeholder="Ex: Pedrinho"
                />
              </div>
              <div>
                <label className="input-label">Idade (opcional)</label>
                <input
                  type="number"
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(e.target.value)}
                  className="input-field"
                  placeholder="Ex: 4"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowChildModal(false)} className="btn-outline flex-1 py-3">
                  Cancelar
                </button>
                <button onClick={addChild} className="btn-secondary flex-1 py-3">
                  🌟 Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
