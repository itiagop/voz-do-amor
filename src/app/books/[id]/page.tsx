'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { getInitials, getAvatarColor } from '@/lib/utils'

type Reader = {
  id: string
  name: string
  avatar: string | null
  relation: string | null
}

type Child = {
  id: string
  name: string
  age: number | null
  color: string
}

type Book = {
  id: string
  title: string
  author: string
  pageCount: number
  description: string
  category: string
}

export default function BookDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [readers, setReaders] = useState<Reader[]>([])
  const [childs, setChilds] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReader, setSelectedReader] = useState<string>('')
  const [selectedChild, setSelectedChild] = useState<string>('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [bookRes, readersRes, childsRes] = await Promise.all([
        fetch(`/api/books/${params.id}`),
        fetch('/api/readers'),
        fetch('/api/childs'),
      ])

      if (!bookRes.ok) throw new Error()
      const bookData = await bookRes.json()
      const readersData = await readersRes.json()
      const childsData = await childsRes.json()

      setBook(bookData)
      setReaders(readersData)
      setChilds(childsData)
    } catch {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  async function startRecording() {
    if (!selectedReader) {
      toast.error('Selecione quem vai ler a história')
      return
    }

    setCreating(true)
    try {
      const res = await fetch('/api/recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          readerId: selectedReader,
          bookId: params.id,
          childId: selectedChild || undefined,
        }),
      })

      if (!res.ok) throw new Error()
      const recording = await res.json()

      router.push(`/record/${recording.id}`)
    } catch {
      toast.error('Erro ao iniciar gravação')
    } finally {
      setCreating(false)
    }
  }

  const categoryEmoji: Record<string, string> = {
    infantil: '🧸',
    'conto de fadas': '👑',
    clássico: '📖',
    aventura: '🗺️',
  }

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-warmth-300 border-t-warmth-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <p className="text-cozy-500">Livro não encontrado</p>
      </div>
    )
  }

  return (
    <div className="page-container p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/books" className="text-cozy-400 hover:text-cozy-600 mb-6 inline-block">
          ← Voltar para biblioteca
        </Link>

        <div className="card p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 aspect-[3/4] bg-gradient-to-br from-warmth-100 via-warmth-200 to-cozy-100 rounded-2xl flex items-center justify-center">
              <span className="text-8xl">{categoryEmoji[book.category] || '📚'}</span>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-cozy-800 mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-cozy-400 mb-4">{book.author}</p>
              <p className="text-cozy-600 mb-6">{book.description}</p>

              <div className="flex items-center gap-3 mb-8">
                <span className="bg-warmth-100 text-warmth-600 px-4 py-2 rounded-full text-sm font-semibold">
                  {book.pageCount} páginas
                </span>
                <span className="bg-story-100 text-story-600 px-4 py-2 rounded-full text-sm font-semibold capitalize">
                  {book.category}
                </span>
              </div>

              <div className="border-t border-warmth-100 pt-6 space-y-8">
                {/* Leitor */}
                <div>
                  <h3 className="font-bold text-cozy-800 text-lg mb-4">
                    Quem vai ler essa história?
                  </h3>

                  {readers.length === 0 ? (
                    <div className="bg-warmth-50 rounded-2xl p-6 text-center mb-4">
                      <p className="text-cozy-500 mb-3">Nenhum leitor cadastrado</p>
                      <Link href="/dashboard" className="btn-primary text-sm py-2 px-5">
                        Adicionar leitor
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {readers.map((reader) => (
                        <button
                          key={reader.id}
                          onClick={() => setSelectedReader(reader.id)}
                          className={`p-4 rounded-2xl text-center transition-all duration-200 ${
                            selectedReader === reader.id
                              ? 'bg-warmth-500 text-white shadow-lg scale-105'
                              : 'bg-warmth-50 text-cozy-600 hover:bg-warmth-100'
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-lg font-bold ${
                              selectedReader === reader.id
                                ? 'bg-white/30 text-white'
                                : 'text-white'
                            }`}
                            style={{
                              backgroundColor: selectedReader === reader.id
                                ? 'rgba(255,255,255,0.2)'
                                : getAvatarColor(reader.name),
                            }}
                          >
                            {getInitials(reader.name)}
                          </div>
                          <div className="font-semibold text-sm">{reader.name}</div>
                          {reader.relation && (
                            <div className="text-xs opacity-70">{reader.relation}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Criança (opcional) */}
                <div>
                  <h3 className="font-bold text-cozy-800 text-lg mb-2">
                    Pra quem é essa história?
                  </h3>
                  <p className="text-sm text-cozy-400 mb-4">Opcional — depois você pode escolher</p>

                  {childs.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        onClick={() => setSelectedChild('')}
                        className={`p-3 rounded-2xl text-center transition-all duration-200 ${
                          selectedChild === ''
                            ? 'bg-cozy-500 text-white shadow-lg'
                            : 'bg-warmth-50 text-cozy-500 hover:bg-warmth-100'
                        }`}
                      >
                        <span className="text-2xl block mb-1">📚</span>
                        <div className="font-semibold text-xs">Qualquer criança</div>
                      </button>

                      {childs.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => setSelectedChild(child.id)}
                          className={`p-3 rounded-2xl text-center transition-all duration-200 ${
                            selectedChild === child.id
                              ? 'text-white shadow-lg'
                              : 'bg-warmth-50 text-cozy-600 hover:bg-warmth-100'
                          }`}
                          style={{
                            backgroundColor: selectedChild === child.id ? child.color : undefined,
                          }}
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1 text-white text-sm font-bold"
                            style={{ backgroundColor: child.color }}
                          >
                            {getInitials(child.name)}
                          </div>
                          <div className="font-semibold text-sm">{child.name}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-warmth-50 rounded-2xl p-4 text-center">
                      <p className="text-cozy-400 text-sm">Nenhuma criança cadastrada ainda</p>
                    </div>
                  )}
                </div>

                {readers.length > 0 && (
                  <button
                    onClick={startRecording}
                    disabled={creating || !selectedReader}
                    className="btn-primary text-lg w-full md:w-auto"
                  >
                    {creating ? 'Preparando...' : '🎙️ Começar a gravar'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
