'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type Book = {
  id: string
  title: string
  author: string
  cover: string | null
  pageCount: number
  description: string
  category: string
}

export default function BooksPage() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('todas')

  useEffect(() => {
    loadBooks()
  }, [])

  async function loadBooks() {
    try {
      const res = await fetch('/api/books')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setBooks(data)
    } catch {
      toast.error('Erro ao carregar livros')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['todas', ...Array.from(new Set(books.map((b) => b.category)))]

  const filtered = books.filter((book) => {
    const matchSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === 'todas' || book.category === category
    return matchSearch && matchCategory
  })

  const categoryEmoji: Record<string, string> = {
    infantil: '🧸',
    'conto de fadas': '👑',
    clássico: '📖',
    aventura: '🗺️',
  }

  return (
    <div className="page-container p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <Link href="/dashboard" className="text-cozy-400 hover:text-cozy-600 mb-4 inline-block">
            ← Voltar
          </Link>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gradient mb-2">
            Biblioteca de Histórias
          </h1>
          <p className="text-cozy-500 text-lg">
            Escolha um livro para gravar sua voz
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar livro..."
            className="input-field flex-1"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field md:w-48"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'todas' ? 'Todas' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-warmth-300 border-t-warmth-500 rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="card group hover:-translate-y-1"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-warmth-100 via-warmth-200 to-cozy-100 flex items-center justify-center relative">
                  <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-500">
                    {categoryEmoji[book.category] || '📚'}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-xs font-semibold text-cozy-600 px-3 py-1 rounded-full">
                    {book.pageCount} págs
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-cozy-800 text-lg leading-tight mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-cozy-400">{book.author}</p>
                  <p className="text-xs text-cozy-300 mt-2 line-clamp-2">
                    {book.description}
                  </p>
                  <div className="mt-4">
                    <span className="btn-primary text-xs py-2 px-4 inline-block group-hover:shadow-lg transition-shadow">
                      Gravar história
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-cozy-500 text-lg">Nenhum livro encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}
