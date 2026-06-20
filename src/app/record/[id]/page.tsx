'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDuration } from '@/lib/utils'
import { Certificate } from '@/components/certificate'

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
        toast.success('Página salva! ✨')
      } else {
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
    loadRecording()
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

  if (!recording) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <span className="text-6xl block mb-4">😢</span>
          <p className="text-[#A0897A] text-lg">Gravação não encontrada</p>
          <Link href="/books" className="btn-primary mt-6 inline-block">Voltar aos livros</Link>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="page-container flex items-center justify-center p-4 min-h-[80vh]">
        <div className="max-w-lg text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <span className="text-8xl block mb-6">🎉</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="badge-fun mb-4">✨ História finalizada!</span>
            <h2 className="text-3xl font-bold text-[#4A3728] dark:text-[#E8E0D8] mb-3 mt-4">
              Parabéns! 🎊
            </h2>
            <p className="text-[#6B5744] dark:text-[#C4B8A8] text-lg mb-8 leading-relaxed">
              &ldquo;{recording.book.title}&rdquo; foi gravada com a voz de{' '}
              <strong className="text-[#FF6B35]">{recording.reader.name}</strong>.
              <br />Essa história vai ficar para sempre! 💛
            </p>

            <div className="mb-8">
              <Certificate
                bookTitle={recording.book.title}
                readerName={recording.reader.name}
                childName={recording.child?.name}
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  const text = encodeURIComponent(
                    `📚 Acabei de gravar "${recording.book.title}" com todo carinho! A voz fica para sempre 💛\n\n${window.location.origin}/listen/${recording.child?.id || ''}`
                  )
                  window.open(`https://wa.me/?text=${text}`, '_blank')
                }}
                className="btn-secondary text-lg"
              >
                📲 Compartilhar no WhatsApp
              </button>
              <Link href="/dashboard" className="btn-primary text-lg">
                Voltar ao início
              </Link>
              <Link href="/books" className="btn-outline">
                Gravar outra história
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container min-h-screen p-4 md:p-8">
      {/* Decorative bubbles */}
      <div className="bubble w-32 h-32 bg-[#FF6B35] opacity-5 top-40 left-[-5%]" style={{ animationDelay: '0s' }} />
      <div className="bubble w-24 h-24 bg-[#45B7D1] opacity-5 top-60 right-[-3%]" style={{ animationDelay: '1s' }} />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/books" className="text-[#A0897A] hover:text-[#FF6B35] font-semibold transition-colors flex items-center gap-1">
            <span>←</span> Sair da gravação
          </Link>
          <div className="flex items-center gap-2">
            <span className="badge-ocean text-xs">
              📖 {recording.book.title}
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#4A3728] mb-1">
            {recording.book.title}
          </h1>
          <p className="text-[#A0897A] flex items-center justify-center gap-2">
            <span>🎙️</span> Gravando com <strong className="text-[#FF6B35]">{recording.reader.name}</strong>
          </p>
        </div>

        {/* Progress bar */}
        <div className="recording-card p-6 md:p-8 mb-6">
          {/* Progresso */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#A0897A]">Progresso</span>
              <span className="text-sm font-bold text-[#FF6B35]">
                Página {currentPageIndex + 1} de {totalPages}
              </span>
            </div>
            <div className="w-full bg-[#FFF5F0] rounded-full h-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF6B35] via-[#FF6B9D] to-[#A78BFA] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Page dots */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div
                key={i}
                className={i === currentPageIndex ? 'page-dot-active' : 'page-dot page-dot-inactive'}
              />
            ))}
          </div>

          {/* Story text */}
          <div className="bg-gradient-to-br from-[#FFF5F0] to-[#FFF0F6] rounded-2xl p-6 md:p-8 mb-6 min-h-[220px] flex items-center justify-center border border-[#FFE4D6]">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="story-text text-center max-w-lg"
              >
                {recording.book.pages?.[currentPageIndex] || 'Leia esta página em voz alta com muito carinho.'}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Countdown */}
          <AnimatePresence mode="wait">
            {countdown > 0 && (
              <motion.div
                key="countdown"
                initial={{ scale: 3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-8xl font-bold text-center my-8"
              >
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#FF6B9D] bg-clip-text text-transparent">
                  {countdown}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex flex-col items-center gap-4">
            {!isRecording && !audioBlob && countdown === 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <button
                  onClick={startRecording}
                  className="btn-record"
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </button>
                <p className="text-center text-[#A0897A] text-sm mt-3">
                  Toque para começar a gravar 🎙️
                </p>
              </motion.div>
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
                  className="btn-record recording"
                >
                  <div className="w-8 h-8 bg-white rounded-md" />
                </button>
                <div className="mt-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-500 font-bold">Gravando...</span>
                </div>
              </motion.div>
            )}

            {audioBlob && !isRecording && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-4"
              >
                <div className="flex justify-center gap-4">
                  <button
                    onClick={playRecording}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                      isPlaying
                        ? 'bg-gradient-to-br from-[#45B7D1] to-[#67E8F9] text-white'
                        : 'bg-white text-[#45B7D1] border-2 border-[#B8E6F3] hover:bg-[#F0F8FF]'
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
                    className="w-16 h-16 rounded-full bg-white text-[#A0897A] border-2 border-[#FFE4D6] hover:bg-[#FFF5F0] hover:text-[#FF6B35] flex items-center justify-center shadow-lg transition-all duration-300"
                  >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                    </svg>
                  </button>
                </div>

                {duration > 0 && (
                  <p className="text-center text-sm text-[#A0897A]">
                    ⏱️ {formatDuration(duration)}
                  </p>
                )}

                <button
                  onClick={saveAndNext}
                  disabled={saving}
                  className="btn-primary text-lg w-full"
                >
                  {saving
                    ? '⏳ Salvando...'
                    : currentPageIndex < totalPages - 1
                      ? '✨ Salvar e próxima página →'
                      : '🎉 Finalizar história!'}
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Dica carinhosa */}
        <div className="bg-gradient-to-r from-[#FFF5F0] to-[#FFF0F6] rounded-2xl p-5 text-center border border-[#FFE4D6]">
          <p className="text-[#6B5744] text-sm">
            💛 <strong>Dica:</strong> Leia devagar, com pausas e carinho. A criança vai ouvir sua voz muitas vezes!
          </p>
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  )
}
