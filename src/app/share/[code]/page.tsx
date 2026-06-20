'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getAvatarColor, getInitials } from '@/lib/utils'

type PageRec = { pageNumber: number; audioUrl: string | null; duration: number }
type ShareData = {
  id: string
  book: { title: string; author: string }
  reader: { name: string }
  pages: PageRec[]
  status: string
}

const EMOJIS = ['🌟', '🌈', '🦋', '🌺', '⭐', '🎈', '🍭', '🧁', '🎀', '🌸', '🦄', '🍀', '🌻', '💫']

export default function SharePage() {
  const params = useParams()
  const [data, setData] = useState<ShareData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetch(`/api/share/${params.code}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return }
        setData(d)
      })
      .catch(() => setError('Erro ao carregar'))
      .finally(() => setLoading(false))

    return () => {
      if (audioRef.current) audioRef.current.pause()
    }
  }, [])

  const playPage = useCallback((idx: number) => {
    if (!data) return
    const page = data.pages[idx]
    if (!page?.audioUrl) {
      if (idx < data.pages.length - 1) setTimeout(() => playPage(idx + 1), 1000)
      return
    }

    setCurrentPage(idx)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }

    const audio = new Audio(page.audioUrl)
    audioRef.current = audio
    audio.addEventListener('canplay', () => { audio.play(); setPlaying(true) })
    audio.addEventListener('ended', () => {
      setPlaying(false)
      if (idx < data.pages.length - 1) setTimeout(() => playPage(idx + 1), 1200)
    })
  }, [data])

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-warmth-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-warmth-300 border-t-warmth-500 rounded-full animate-spin" />
    </div>
  )

  if (error || !data) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-warmth-50 flex items-center justify-center p-4">
      <div className="text-center">
        <span className="text-6xl block mb-4">🔗</span>
        <h1 className="text-xl font-bold text-cozy-800 mb-2">História não encontrada</h1>
        <p className="text-cozy-400 mb-6">{error || 'Esse link pode ter expirado'}</p>
        <Link href="/" className="btn-primary text-sm">Ir para o Voz Que Fica</Link>
      </div>
    </div>
  )

  const validPages = data.pages.filter((p) => p.audioUrl)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-warmth-50 p-4 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-6 w-full max-w-sm text-center">
          <span className="text-5xl block mb-4">📖</span>
          <h1 className="text-2xl font-bold text-cozy-800 mb-1">{data.book.title}</h1>
          <p className="text-cozy-400 text-sm mb-4">Lido por {data.reader.name}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-4 w-full max-w-sm text-center">
          <span className="text-7xl block mb-4">{EMOJIS[currentPage % EMOJIS.length]}</span>
          <p className="text-cozy-400 text-sm">Página {currentPage + 1} de {validPages.length}</p>
        </div>

        <div className="flex gap-2 mb-6">
          {data.pages.map((page, idx) => (
            <button
              key={idx}
              onClick={() => playPage(idx)}
              disabled={!page.audioUrl}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                currentPage === idx
                  ? 'bg-warmth-500 text-white scale-125 shadow-lg'
                  : page.audioUrl
                    ? 'bg-warmth-200 text-cozy-600'
                    : 'bg-gray-100 text-gray-300'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => playPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-cozy-400 disabled:opacity-30">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>
          <button onClick={() => { if (playing && audioRef.current) { audioRef.current.pause(); setPlaying(false) } else { playPage(currentPage) } }}
            className="w-20 h-20 rounded-full bg-warmth-500 text-white flex items-center justify-center shadow-2xl active:scale-95">
            {playing ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <button onClick={() => playPage(Math.min(validPages.length - 1, currentPage + 1))} disabled={currentPage >= validPages.length - 1}
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-cozy-400 disabled:opacity-30">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-xs text-cozy-300">Com 💛 pelo Voz Que Fica</p>
        <Link href="/" className="text-xs text-warmth-400 hover:underline">vozquefica.com</Link>
      </div>
    </div>
  )
}
