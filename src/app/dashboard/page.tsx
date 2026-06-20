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
      toast.success(`${newReaderName} foi adicionado(a)!`)
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
      toast.success(`${newChildName} foi adicionado(a)!`)
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
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-warmth-300 border-t-warmth-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cozy-500 text-lg">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-10">
        <div className="flex items-center justify-between">
          <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gradient">
                Olá, {user?.name?.split(' ')[0]}!
                {user?.role === 'admin' && (
                  <span className="ml-3 text-sm font-sans font-semibold text-white bg-warmth-500 px-3 py-1 rounded-full align-middle">
                    Admin
                  </span>
                )}
              </h1>
            <p className="text-cozy-500 mt-1 text-lg">
              Aqui você cria histórias que ficam pra sempre
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-cozy-400 hover:text-cozy-600 transition-colors text-sm"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Leitores */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-cozy-800">Quem vai ler?</h2>
              <p className="text-cozy-500">Adicione quem vai gravar a voz</p>
            </div>
            <button
              onClick={() => setShowReaderModal(true)}
              className="btn-primary text-sm py-2 px-5"
            >
              + Adicionar
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userData?.readers.map((reader) => (
              <div key={reader.id} className="card-child p-5 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold"
                  style={{ backgroundColor: getAvatarColor(reader.name) }}
                >
                  {getInitials(reader.name)}
                </div>
                <h3 className="font-semibold text-cozy-800">{reader.name}</h3>
                {reader.relation && (
                  <p className="text-sm text-cozy-400">{reader.relation}</p>
                )}
                <p className="text-xs text-cozy-300 mt-2">
                  {reader.recordings.length} histórias
                </p>
              </div>
            ))}

            {(!userData?.readers || userData.readers.length === 0) && (
              <div className="col-span-full text-center py-10 bg-warmth-50 rounded-3xl border-2 border-dashed border-warmth-200">
                <p className="text-warmth-500 text-lg mb-2">Nenhum leitor ainda</p>
                <p className="text-cozy-400">Adicione quem vai ler as histórias</p>
              </div>
            )}
          </div>
        </section>

        {/* Crianças */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-cozy-800">Quem vai ouvir?</h2>
              <p className="text-cozy-500">Adicione as crianças que vão receber as histórias</p>
            </div>
            <button
              onClick={() => setShowChildModal(true)}
              className="btn-secondary text-sm py-2 px-5"
            >
              + Adicionar
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userData?.childs.map((child) => (
              <Link
                key={child.id}
                href={`/listen/${child.id}`}
                className="card-child p-5 text-center group"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: child.color }}
                >
                  {getInitials(child.name)}
                </div>
                <h3 className="font-semibold text-cozy-800">{child.name}</h3>
                {child.age && (
                  <p className="text-sm text-cozy-400">{child.age} anos</p>
                )}
                <p className="text-xs text-cozy-300 mt-2">
                  {child.recordings.length} histórias gravadas pra {child.name === 'você' ? 'você' : 'ela'}
                </p>
              </Link>
            ))}

            {(!userData?.childs || userData.childs.length === 0) && (
              <div className="col-span-full text-center py-10 bg-warmth-50 rounded-3xl border-2 border-dashed border-warmth-200">
                <p className="text-warmth-500 text-lg mb-2">Nenhuma criança ainda</p>
                <p className="text-cozy-400">Adicione quem vai ouvir as histórias</p>
              </div>
            )}
          </div>
        </section>

        {/* Biblioteca */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-cozy-800">Biblioteca</h2>
              <p className="text-cozy-500">Escolha um livro pra gravar</p>
            </div>
            <Link href="/books" className="btn-outline text-sm py-2 px-5">
              Ver todos
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/books"
              className="card-child p-6 text-center flex flex-col items-center justify-center min-h-[180px]"
            >
              <span className="text-4xl mb-3">📚</span>
              <span className="text-cozy-600 font-semibold">Explorar livros</span>
              <span className="text-sm text-cozy-400 mt-1">Escolha um pra começar</span>
            </Link>
          </div>
        </section>
      </div>

      {/* Modal Leitor */}
      {showReaderModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowReaderModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-cozy-800 mb-5">Adicionar Leitor</h3>
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
              <div className="flex gap-3">
                <button onClick={() => setShowReaderModal(false)} className="btn-outline flex-1 text-sm py-2">
                  Cancelar
                </button>
                <button onClick={addReader} className="btn-primary flex-1 text-sm py-2">
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criança */}
      {showChildModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowChildModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-cozy-800 mb-5">Adicionar Criança</h3>
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
              <div className="flex gap-3">
                <button onClick={() => setShowChildModal(false)} className="btn-outline flex-1 text-sm py-2">
                  Cancelar
                </button>
                <button onClick={addChild} className="btn-secondary flex-1 text-sm py-2">
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
