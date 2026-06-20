'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function CreateBookPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [pages, setPages] = useState<string[]>(['', '', ''])
  const [saving, setSaving] = useState(false)

  function addPage() {
    setPages([...pages, ''])
  }

  function removePage(idx: number) {
    if (pages.length <= 1) return
    setPages(pages.filter((_, i) => i !== idx))
  }

  function updatePage(idx: number, text: string) {
    const next = [...pages]
    next[idx] = text
    setPages(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Dê um título para a história')
      return
    }
    const validPages = pages.filter((p) => p.trim())
    if (validPages.length === 0) {
      toast.error('Adicione pelo menos uma página com texto')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim() || 'Criado por mim',
          pages: validPages,
          pageCount: validPages.length,
          description: validPages[0].slice(0, 100) + (validPages[0].length > 100 ? '...' : ''),
          category: 'personalizado',
        }),
      })

      if (!res.ok) throw new Error()
      const book = await res.json()
      toast.success('História criada! 📚')
      router.push(`/books/${book.id}`)
    } catch {
      toast.error('Erro ao criar história')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-container p-4 md:p-8 min-h-screen">
      {/* Decorative bubbles */}
      <div className="bubble w-40 h-40 bg-[#A78BFA] opacity-5 top-0 right-[-5%]" style={{ animationDelay: '0s' }} />
      <div className="bubble w-28 h-28 bg-[#FFD93D] opacity-5 bottom-0 left-[-3%]" style={{ animationDelay: '1s' }} />

      <div className="max-w-2xl mx-auto relative z-10">
        <Link href="/books" className="text-[#A0897A] hover:text-[#FF6B35] font-semibold mb-6 inline-block transition-colors">
          ← Voltar para biblioteca
        </Link>

        <div className="text-center mb-8">
          <span className="text-6xl block mb-4">✍️</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
            Criar História
          </h1>
          <p className="text-[#A0897A] text-lg">
            Escreva sua própria história para gravar com amor 💛
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="card p-6 md:p-8">
            <div className="space-y-4">
              <div>
                <label className="input-label">📖 Título da história</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="Ex: As Aventuras do Pequeno Herói"
                  required
                />
              </div>
              <div>
                <label className="input-label">✍️ Autor (opcional)</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="input-field"
                  placeholder="Ex: Vovó Maria"
                />
              </div>
            </div>
          </div>

          {/* Páginas */}
          <div className="card p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-[#4A3728] dark:text-[#E8E0D8]">
                  📝 Páginas
                </h2>
                <p className="text-sm text-[#A0897A]">Escreva o texto de cada página</p>
              </div>
              <span className="badge-sun text-xs">
                {pages.filter((p) => p.trim()).length} página(s)
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {pages.map((text, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF6B9D] flex items-center justify-center text-white text-xs font-bold mt-3">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={text}
                          onChange={(e) => updatePage(idx, e.target.value)}
                          className="input-field min-h-[100px] resize-y"
                          placeholder={`Texto da página ${idx + 1}...`}
                          rows={3}
                        />
                      </div>
                      {pages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePage(idx)}
                          className="flex-shrink-0 w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 flex items-center justify-center transition-colors mt-3"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                type="button"
                onClick={addPage}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-[#FFE4D6] dark:border-[#2E2E42] text-[#A0897A] dark:text-[#8A7E70] hover:text-[#FF6B35] hover:border-[#FF6B35] transition-all font-semibold"
              >
                + Adicionar página
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 text-lg py-4"
            >
              {saving ? '⏳ Criando...' : '✨ Criar história'}
            </button>
            <Link href="/books" className="btn-outline flex-1 text-center py-4">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
