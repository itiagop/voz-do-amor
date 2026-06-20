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
  book: { id: string; title: string; author: string; pageCount: number }
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

  async function shareRecording(rec: Recording) {
    try {
      const res = await fetch('/api/share/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordingId: rec.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await navigator.clipboard.writeText(data.shareUrl)
      toast.success('Link copiado! Compartilhe com a família 💛')
    } catch {
      toast.error('Erro ao gerar link')
    }
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
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlaying(false)
    setTimeout(() => playPage(idx), 300)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-warmth-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!child) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-warmth-50 flex items-center justify-center p-4">
        <div className="text-center">
          <span className="text-6xl block mb-4">👶</span>
          <p className="text-cozy-500 text-lg mb-4">Criança não encontrada</p>
          <Link href="/dashboard" className="btn-primary">Voltar</Link>
        </div>
      </div>
    )
  }

  const hasCompletedPages = selected?.pages.filter((p) => p.audioUrl) || []
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]

  if (recordings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-warmth-50 p-4">
        <div className="max-w-md mx-auto pt-16 text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl font-bold shadow-xl"
            style={{ backgroundColor: child.color }}
          >
            {getInitials(child.name)}
          </div>
          <h1 className="text-3xl font-display font-bold text-cozy-800 mb-2">
            Oi, {child.name}! 💛
          </h1>
          <p className="text-cozy-400 mb-2">{child.age ? `${child.age} anos` : ''}</p>
          <div className="bg-white/80 backdrop-blur rounded-3xl p-10 shadow-lg mt-6">
            <span className="text-6xl block mb-4">📭</span>
            <p className="text-cozy-500 text-lg mb-1">Nenhuma história ainda</p>
            <p className="text-cozy-400 text-sm mb-6">Alguém especial está preparando uma pra você...</p>
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
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-warmth-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold shadow-xl"
              style={{ backgroundColor: child.color }}
            >
              {getInitials(child.name)}
            </div>
            <h1 className="text-3xl font-display font-bold text-cozy-800">
              Oi, {child.name}!
            </h1>
            <p className="text-cozy-400 mt-1">Escolha uma história</p>
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
                      <h3 className="font-bold text-cozy-800">{rec.book.title}</h3>
                      <p className="text-cozy-400 text-xs">Lido por {rec.reader.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-warmth-100 rounded-full overflow-hidden">
                          <div className="h-full bg-warmth-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-cozy-400">{pct}%</span>
                      </div>
                    </div>
                    <span className="text-warmth-500 text-lg">▶</span>
                  </button>
                  <button
                    onClick={() => shareRecording(rec)}
                    className="w-9 h-9 rounded-full bg-warmth-50 hover:bg-warmth-100 flex items-center justify-center text-cozy-400 hover:text-warmth-500 transition-all flex-shrink-0"
                    title="Compartilhar"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/dashboard" className="text-cozy-400 hover:text-cozy-600 text-sm">
              ← Voltar
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-warmth-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white/80 backdrop-blur rounded-3xl p-10 shadow-xl mb-6">
            <span className="text-7xl block mb-6">📖</span>
            <h1 className="text-3xl font-display font-bold text-cozy-800 mb-2">
              {selected!.book.title}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: getAvatarColor(selected!.reader.name) }}
              >
                {getInitials(selected!.reader.name)}
              </div>
              <span className="text-cozy-500">
                Com a voz de <strong>{selected!.reader.name}</strong>
              </span>
            </div>
            <p className="text-cozy-400 mb-6 text-sm">
              {selected!.book.pageCount} páginas • {hasCompletedPages.length} gravadas
            </p>
            <button onClick={beginPlay} className="btn-primary text-xl px-12 py-4 rounded-full">
              ▶ Ouvir
            </button>
          </div>
          <button onClick={() => setView('select')} className="text-cozy-400 hover:text-cozy-600 text-sm">
            ← Escolher outra
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-warmth-50 p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button onClick={stopPlay} className="text-cozy-400 hover:text-cozy-600 text-sm">
          ← Sair
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: child.color }}
          >
            {getInitials(child.name)}
          </div>
          <span className="text-sm text-cozy-400">{selected?.reader.name}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl shadow-xl p-10 mb-6 w-full max-w-sm text-center"
          >
            <span className="text-7xl block mb-4">{EMOJIS[currentPage % EMOJIS.length]}</span>
            <p className="text-cozy-400 text-sm">Página {currentPage + 1}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mb-6">
          {selected?.pages.map((page, idx) => (
            <button
              key={page.id}
              onClick={() => goToPage(idx)}
              disabled={!page.audioUrl}
              className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                currentPage === idx
                  ? 'bg-warmth-500 text-white scale-125 shadow-lg ring-4 ring-warmth-200'
                  : page.audioUrl
                    ? 'bg-warmth-200 text-cozy-600 hover:bg-warmth-300'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => goToPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-cozy-400 hover:text-cozy-600 disabled:opacity-30 transition-all"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          <button
            onClick={togglePause}
            className="w-20 h-20 rounded-full bg-warmth-500 hover:bg-warmth-600 text-white flex items-center justify-center shadow-2xl transition-all active:scale-95"
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
            onClick={() => goToPage(Math.min((selected?.pages.length || 1) - 1, currentPage + 1))}
            disabled={currentPage >= (selected?.pages.length || 1) - 1}
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-cozy-400 hover:text-cozy-600 disabled:opacity-30 transition-all"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>

        <p className="text-cozy-400 text-sm mt-4">
          Voz de <strong>{selected?.reader.name}</strong>
        </p>
      </div>
    </div>
  )
}
