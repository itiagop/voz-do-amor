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

  const categoryColors: Record<string, string> = {
    infantil: 'from-[#FF6B9D] to-[#E8A0BF]',
    'conto de fadas': 'from-[#A78BFA] to-[#C4B5FD]',
    clássico: 'from-[#FF6B35] to-[#FF8C42]',
    aventura: 'from-[#45B7D1] to-[#67E8F9]',
  }

  return (
    <div className="page-container p-4 md:p-8">
      {/* Decorative bubbles */}
      <div className="bubble w-48 h-48 bg-[#FF6B35] opacity-5 top-0 right-[-8%]" style={{ animationDelay: '0s' }} />
      <div className="bubble w-32 h-32 bg-[#45B7D1] opacity-5 bottom-0 left-[-5%]" style={{ animationDelay: '1s' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-8">
          <Link href="/dashboard" className="text-[#A0897A] hover:text-[#FF6B35] font-semibold mb-4 inline-block transition-colors">
            ← Voltar
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
            📚 Biblioteca de Histórias
          </h1>
          <p className="text-[#A0897A] text-lg">
            Escolha um livro para gravar sua voz com carinho
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar livro..."
              className="input-field pl-12"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field md:w-48"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'todas' ? '🌟 Todas' : `${categoryEmoji[cat] || '📚'} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-[#FFE4D6] border-t-[#FF6B35] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#A0897A]">Carregando livros...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="card-fun group"
              >
                <div className={`aspect-[3/4] bg-gradient-to-br ${categoryColors[book.category] || 'from-[#FFF5F0] to-[#FFE4D6]'} flex items-center justify-center relative`}>
                  <span className="text-7xl opacity-60 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3 inline-block">
                    {categoryEmoji[book.category] || '📚'}
                  </span>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm shadow-sm text-xs font-bold text-[#4A3728] px-3 py-1.5 rounded-full">
                    📄 {book.pageCount} págs
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#4A3728] text-lg leading-tight mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-[#A0897A]">{book.author}</p>
                  <p className="text-xs text-[#B8A89A] mt-2 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white text-xs font-bold py-2.5 px-5 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      🎙️ Gravar história
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
            <p className="text-[#A0897A] text-lg mb-2">Nenhum livro encontrado</p>
            <p className="text-[#B8A89A] text-sm">Tente buscar por outro termo ou categoria</p>
          </div>
        )}
      </div>
    </div>
  )
}
