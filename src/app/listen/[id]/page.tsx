'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { getAvatarColor, getInitials } from '@/lib/utils'

type PageRecording = {
  id: string
  pageNumber: number
  audioUrl: string | null
  duration: number
}

type Recording = {
  id: string
  status: string
  book: {
    id: string
    title: string
    author: string
    pageCount: number
    pages: string[] | null
  }
  reader: { id: string; name: string; relation: string | null }
  child: { id: string; name: string } | null
  pages: PageRecording[]
}

type ChildData = {
  id: string
  name: string
  age: number | null
  color: string
  recordings: Recording[]
}

const EMOJIS = ['🌟', '🌈', '🦋', '🌺', '⭐', '🎈', '🍭', '🧁', '🎀', '🌸', '🦄', '🍀', '🌻', '💫', '🐱', '🐶', '🦊', '🐼', '🐸', '🦄']

export default function ChildListenPage() {
  const params = useParams()
  const [child, setChild] = useState<ChildData | null>(null)
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [selected, setSelected] = useState<Recording | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'select' | 'intro' | 'play'>('select')
  const [touchStart, setTouchStart] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    loadData()
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  async function loadData() {
    try {
      const res = await fetch('/api/childs')
      if (!res.ok) throw new Error()
      const all: ChildData[] = await res.json()
      const found = all.find((c) => c.id === params.id)
      if (found) {
        setChild(found)
        const valid = found.recordings.filter(
          (r) => r.pages.some((p) => p.audioUrl)
        )
        setRecordings(valid)
      }
    } catch {
      toast.error('Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }

  const playPage = useCallback((idx: number) => {
    if (!selected) return
    const page = selected.pages[idx]
    if (!page?.audioUrl) {
      if (idx < selected.pages.length - 1) {
        setTimeout(() => playPage(idx + 1), 800)
      }
      return
    }

    setCurrentPage(idx)

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    const audio = new Audio(page.audioUrl)
    audioRef.current = audio

    audio.addEventListener('canplay', () => {
      audio.play().catch(() => {})
      setPlaying(true)
    })

    audio.addEventListener('ended', () => {
      setPlaying(false)
      if (idx < selected.pages.length - 1) {
        setTimeout(() => playPage(idx + 1), 1200)
      }
    })
  }, [selected])

  function startStory(rec: Recording) {
    setSelected(rec)
    setView('intro')
  }

  function beginPlay() {
    setView('play')
    setCurrentPage(0)
    setTimeout(() => playPage(0), 500)
  }

  function stopPlay() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlaying(false)
    setView('select')
    setSelected(null)
  }

  function goToPage(idx: number) {
    if (idx < 0 || idx >= (selected?.pages.length || 0)) return
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlaying(false)
    setTimeout(() => playPage(idx), 300)
  }

  function nextPage() {
    if (!selected) return
    const next = currentPage + 1
    if (next < selected.pages.length) goToPage(next)
  }

  function prevPage() {
    const prev = currentPage - 1
    if (prev >= 0) goToPage(prev)
  }

  function togglePause() {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play()
      setPlaying(true)
    } else {
      audioRef.current.pause()
      setPlaying(false)
    }
  }

  function downloadPage(page: PageRecording) {
    if (!page.audioUrl) return
    const a = document.createElement('a')
    a.href = page.audioUrl
    a.download = `pagina-${page.pageNumber}.webm`
    a.click()
  }

  function downloadAllPages(rec: Recording) {
    const pages = rec.pages.filter((p) => p.audioUrl)
    pages.forEach((page, idx) => {
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = page.audioUrl!
        a.download = `${rec.book.title}-pagina-${page.pageNumber}.webm`
        a.click()
      }, idx * 500)
    })
    toast.success(`Baixando ${pages.length} página(s)! 📥`)
  }

  function shareWhatsApp(rec: Recording) {
    const text = encodeURIComponent(
      `📚 *${rec.book.title}* lido por ${rec.reader.name} para ${child?.name || 'uma criança especial'}!\n\n💛 Ouça aqui: ${window.location.origin}/listen/${params.id}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX)
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const diff = e.changedTouches[0].clientX - touchStart
    if (Math.abs(diff) > 60) {
      if (diff > 0) prevPage()
      else nextPage()
    }
  }

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#FFE4D6] border-t-[#FF6B35] rounded-full animate-spin" />
      </div>
    )
  }

  if (!child) {
    return (
      <div className="page-container flex items-center justify-center p-4 min-h-[60vh]">
        <div className="text-center">
          <span className="text-6xl block mb-4">👶</span>
          <p className="text-[#A0897A] text-lg mb-4">Criança não encontrada</p>
          <Link href="/dashboard" className="btn-primary">Voltar</Link>
        </div>
      </div>
    )
  }

  const hasCompletedPages = selected?.pages.filter((p) => p.audioUrl) || []

  if (recordings.length === 0) {
    return (
      <div className="page-container p-4 min-h-screen">
        <div className="max-w-md mx-auto pt-16 text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl font-bold shadow-xl"
            style={{ backgroundColor: child.color }}
          >
            {getInitials(child.name)}
          </div>
          <h1 className="text-3xl font-bold text-[#4A3728] dark:text-[#E8E0D8] mb-2">
            Oi, {child.name}! 💛
          </h1>
          <p className="text-[#A0897A] mb-2">{child.age ? `${child.age} anos` : ''}</p>
          <div className="card p-10 mt-6">
            <span className="text-6xl block mb-4">📭</span>
            <p className="text-[#6B5744] dark:text-[#C4B8A8] text-lg mb-1">Nenhuma história ainda</p>
            <p className="text-[#A0897A] text-sm mb-6">Alguém especial está preparando uma pra você...</p>
            <Link href="/dashboard" className="btn-primary text-sm">
              Voltar
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'select') {
    return (
      <div className="page-container p-4 min-h-screen">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold shadow-xl"
              style={{ backgroundColor: child.color }}
            >
              {getInitials(child.name)}
            </div>
            <h1 className="text-3xl font-bold text-[#4A3728] dark:text-[#E8E0D8]">
              Oi, {child.name}! 👋
            </h1>
            <p className="text-[#A0897A] mt-1">Escolha uma história para ouvir</p>
          </div>

          <div className="grid gap-4">
            {recordings.map((rec) => {
              const emojis = ['📖', '🌟', '🌈', '🎠', '🏰', '🧙', '🐉', '👸', '🤴', '🧜‍♀️']
              const e = emojis[Math.floor(Math.random() * emojis.length)]
              const pct = Math.round((rec.pages.filter((p) => p.audioUrl).length / rec.pages.length) * 100)
              return (
                <div key={rec.id} className="card p-4 flex items-center gap-4 w-full">
                  <button onClick={() => startStory(rec)} className="flex items-center gap-4 flex-1 min-w-0 text-left">
                    <span className="text-4xl">{e}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#4A3728] dark:text-[#E8E0D8]">{rec.book.title}</h3>
                      <p className="text-[#A0897A] text-xs">Lido por {rec.reader.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-[#FFE4D6] dark:bg-[#2E2E42] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FF6B9D] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-[#A0897A]">{pct}%</span>
                      </div>
                    </div>
                    <span className="text-[#FF6B35] text-lg">▶</span>
                  </button>
                  <button
                    onClick={() => shareWhatsApp(rec)}
                    className="w-9 h-9 rounded-full bg-green-50 dark:bg-green-900/30 hover:bg-green-100 flex items-center justify-center text-green-500 hover:text-green-600 transition-all flex-shrink-0"
                    title="Compartilhar no WhatsApp"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => downloadAllPages(rec)}
                    className="w-9 h-9 rounded-full bg-[#FFF5F0] dark:bg-[#2E1E1E] hover:bg-[#FFE4D6] flex items-center justify-center text-[#A0897A] hover:text-[#FF6B35] transition-all flex-shrink-0"
                    title="Download MP3"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/dashboard" className="text-[#A0897A] hover:text-[#FF6B35] text-sm font-semibold">
              ← Voltar
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'intro') {
    return (
      <div className="page-container flex items-center justify-center p-4 min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="card p-10 mb-6">
            <span className="text-7xl block mb-6">📖</span>
            <h1 className="text-3xl font-bold text-[#4A3728] dark:text-[#E8E0D8] mb-2">
              {selected!.book.title}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: getAvatarColor(selected!.reader.name) }}
              >
                {getInitials(selected!.reader.name)}
              </div>
              <span className="text-[#6B5744] dark:text-[#C4B8A8]">
                Com a voz de <strong className="text-[#FF6B35]">{selected!.reader.name}</strong>
              </span>
            </div>
            <p className="text-[#A0897A] mb-6 text-sm">
              {selected!.book.pageCount} páginas • {hasCompletedPages.length} gravadas
            </p>
            <button onClick={beginPlay} className="btn-primary text-xl px-12 py-4 rounded-full w-full">
              ▶ Ouvir história
            </button>
            <button onClick={() => setView('select')} className="text-[#A0897A] hover:text-[#FF6B35] text-sm mt-4 block w-full text-center font-semibold">
              ← Escolher outra
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="page-container min-h-screen p-4 flex flex-col">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4 max-w-lg mx-auto w-full">
        <button onClick={stopPlay} className="text-[#A0897A] hover:text-[#FF6B35] text-sm font-semibold transition-colors flex items-center gap-1">
          <span>←</span> Sair
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
            style={{ backgroundColor: child.color }}
          >
            {getInitials(child.name)}
          </div>
          <span className="text-sm text-[#A0897A]">{selected?.reader.name}</span>
        </div>
      </div>

      {/* Story area - swipeable */}
      <div
        className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Story card with both emoji and text */}
            <div className="card p-6 md:p-8 mb-4 text-center">
              <span className="text-5xl block mb-4">{EMOJIS[currentPage % EMOJIS.length]}</span>
              <p className="text-sm text-[#A0897A] mb-3">Página {currentPage + 1}</p>

              {/* Story text */}
              {selected?.book.pages?.[currentPage] && (
                <div className="bg-gradient-to-br from-[#FFF5F0] to-[#FFF0F6] dark:from-[#16162A] dark:to-[#1A162E] rounded-2xl p-5 mb-2">
                  <p className="story-text text-base md:text-lg text-center">
                    {selected.book.pages[currentPage]}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Page dots */}
        <div className="flex gap-2 mb-4">
          {selected?.pages.map((page, idx) => (
            <button
              key={page.id}
              onClick={() => goToPage(idx)}
              disabled={!page.audioUrl}
              className={`transition-all ${
                currentPage === idx
                  ? 'w-8 h-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF6B9D]'
                  : page.audioUrl
                    ? 'w-3 h-3 rounded-full bg-[#FFD4C6] dark:bg-[#4E3E32] hover:bg-[#FF6B35]'
                    : 'w-3 h-3 rounded-full bg-[#F0E8E0] dark:bg-[#2E2E2E] cursor-not-allowed'
              }`}
            />
          ))}
        </div>

        {/* Main controls */}
        <div className="flex items-center gap-6 mb-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="w-12 h-12 rounded-full bg-white dark:bg-[#1E1E2E] shadow-md flex items-center justify-center text-[#A0897A] hover:text-[#FF6B35] disabled:opacity-30 transition-all hover:shadow-lg border border-[#FFE4D6] dark:border-[#2E2E42]"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>

          <button
            onClick={togglePause}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] text-white flex items-center justify-center shadow-2xl transition-all active:scale-95 hover:shadow-3xl"
            style={{ boxShadow: '0 4px 20px rgba(255, 107, 53, 0.5)' }}
          >
            {playing ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage >= (selected?.pages.length || 1) - 1}
            className="w-12 h-12 rounded-full bg-white dark:bg-[#1E1E2E] shadow-md flex items-center justify-center text-[#A0897A] hover:text-[#FF6B35] disabled:opacity-30 transition-all hover:shadow-lg border border-[#FFE4D6] dark:border-[#2E2E42]"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center gap-4 text-xs">
          {selected?.pages[currentPage]?.audioUrl && (
            <button
              onClick={() => downloadPage(selected.pages[currentPage])}
              className="flex items-center gap-1 text-[#A0897A] hover:text-[#FF6B35] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Download
            </button>
          )}
          <span className="text-[#E0D8D0] dark:text-[#3E3E3E]">|</span>
          <button
            onClick={() => shareWhatsApp(selected!)}
            className="flex items-center gap-1 text-green-500 hover:text-green-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
