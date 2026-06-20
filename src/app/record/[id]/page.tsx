'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDuration } from '@/lib/utils'

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
    pageCount: number
    pages: string[] | null
  }
  reader: {
    id: string
    name: string
  }
  child: {
    id: string
    name: string
  } | null
  pages: PageRecording[]
}

export default function RecordPage() {
  const router = useRouter()
  const params = useParams()
  const [recording, setRecording] = useState<Recording | null>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    loadRecording()
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  async function loadRecording() {
    try {
      const res = await fetch(`/api/recordings/${params.id}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setRecording(data)
    } catch {
      toast.error('Erro ao carregar gravação')
    } finally {
      setLoading(false)
    }
  }

  const currentPage = recording?.pages[currentPageIndex]
  const totalPages = recording?.book.pageCount || 0
  const progress = ((currentPageIndex + 1) / totalPages) * 100

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)

        const audioUrl = URL.createObjectURL(blob)
        const audio = new Audio(audioUrl)
        audio.addEventListener('loadedmetadata', () => {
          setDuration(audio.duration)
        })
      }

      // Countdown
      setCountdown(3)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setCountdown(0)
            mediaRecorder.start()
            setIsRecording(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch {
      toast.error('Permita o acesso ao microfone para gravar')
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }

  function playRecording() {
    if (audioBlob && audioRef.current) {
      const url = URL.createObjectURL(audioBlob)
      audioRef.current.src = url
      audioRef.current.play()
      setIsPlaying(true)
      audioRef.current.onended = () => setIsPlaying(false)
    }
  }

  async function saveAndNext() {
    if (!audioBlob || !currentPage) return

    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, `page-${currentPage.pageNumber}.webm`)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) throw new Error()
      const { url } = await uploadRes.json()

      const updateRes = await fetch(`/api/recordings/${params.id}/pages`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: currentPage.id,
          audioUrl: url,
          duration,
        }),
      })

      if (!updateRes.ok) throw new Error()

      setAudioBlob(null)
      setDuration(0)

      if (currentPageIndex < totalPages - 1) {
        setCurrentPageIndex(currentPageIndex + 1)
        toast.success('Página salva!')
      } else {
        // Finalizou
        await fetch(`/api/recordings/${params.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'completed' }),
        })
        setCompleted(true)
        toast.success('História gravada com sucesso! 🎉')
      }
    } catch {
      toast.error('Erro ao salvar gravação')
    } finally {
      setSaving(false)
    }
  }

  function redoPage() {
    setAudioBlob(null)
    setDuration(0)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = new Audio()
    }
    setIsPlaying(false)
    // Re-ler a página
    loadRecording()
  }

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-warmth-300 border-t-warmth-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!recording) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <p className="text-cozy-500">Gravação não encontrada</p>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="page-container flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <span className="text-8xl block mb-6">🎉</span>
          </motion.div>
          <h2 className="text-3xl font-display font-bold text-cozy-800 mb-3">
            História Gravada!
          </h2>
          <p className="text-cozy-500 text-lg mb-8">
            "{recording.book.title}" foi gravada com a voz de {recording.reader.name}. Essa história vai ficar para sempre!
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard" className="btn-primary text-lg">
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/books" className="text-cozy-400 hover:text-cozy-600 mb-6 inline-block">
          ← Sair da gravação
        </Link>

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-cozy-800 mb-1">
            {recording.book.title}
          </h1>
          <p className="text-cozy-400">
            Gravando com {recording.reader.name}
          </p>
        </div>

        {/* Barra de progresso */}
        <div className="w-full bg-warmth-100 rounded-full h-3 mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-warmth-400 to-warmth-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Indicador de página */}
        <div className="text-center mb-6">
          <span className="text-sm font-semibold text-cozy-400">
            Página {currentPageIndex + 1} de {totalPages}
          </span>
        </div>

        {/* Card da página */}
        <div className="card p-6 md:p-8 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-display font-bold text-cozy-800 mb-4 text-center">
              Página {currentPageIndex + 1}
            </h2>
            <div className="bg-warmth-50 rounded-2xl p-6 min-h-[200px] flex items-center justify-center">
              <p className="text-cozy-700 text-xl md:text-2xl leading-relaxed font-serif italic text-center">
                {recording.book.pages?.[currentPageIndex] || 'Leia esta página em voz alta com muito carinho.'}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {countdown > 0 && (
              <motion.div
                key="countdown"
                initial={{ scale: 2, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="text-8xl font-bold text-warmth-500 my-8"
              >
                {countdown}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controles */}
          <div className="flex flex-col items-center gap-4">
            {!isRecording && !audioBlob && countdown === 0 && (
              <button
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-warmth-500 hover:bg-warmth-600 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all active:scale-95"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </button>
            )}

            {isRecording && (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex flex-col items-center"
              >
                <button
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xl transition-all"
                >
                  <div className="w-8 h-8 bg-white rounded-sm" />
                </button>
                <span className="mt-3 text-red-500 font-semibold animate-pulse">
                  Gravando...
                </span>
              </motion.div>
            )}

            {audioBlob && !isRecording && (
              <div className="w-full space-y-4">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={playRecording}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      isPlaying
                        ? 'bg-story-500 text-white'
                        : 'bg-story-100 text-story-600 hover:bg-story-200'
                    }`}
                  >
                    {isPlaying ? (
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    ) : (
                      <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={redoPage}
                    className="w-16 h-16 rounded-full bg-warmth-100 hover:bg-warmth-200 text-cozy-500 flex items-center justify-center shadow-lg transition-all"
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                    </svg>
                  </button>
                </div>

                {duration > 0 && (
                  <p className="text-sm text-cozy-400">
                    {formatDuration(duration)}
                  </p>
                )}

                <button
                  onClick={saveAndNext}
                  disabled={saving}
                  className="btn-primary text-lg w-full"
                >
                  {saving
                    ? 'Salvando...'
                    : currentPageIndex < totalPages - 1
                      ? 'Salvar e próxima página →'
                      : 'Finalizar história! 🎉'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dica carinhosa */}
        <div className="bg-warmth-50 rounded-2xl p-5 text-center">
          <p className="text-cozy-500 text-sm">
            💛 Dica: Leia devagar, com pausas. A criança vai ouvir sua voz muitas vezes.
          </p>
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  )
}
