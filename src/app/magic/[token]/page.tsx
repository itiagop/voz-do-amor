'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useUserStore } from '@/lib/store'

export default function MagicLinkPage() {
  const router = useRouter()
  const params = useParams()
  const { setUser } = useUserStore()
  const [status, setStatus] = useState<'verificando' | 'sucesso' | 'erro'>('verificando')
  const [error, setError] = useState('')

  useEffect(() => {
    verifyToken()
  }, [])

  async function verifyToken() {
    try {
      const res = await fetch('/api/auth/verify-magic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: params.token }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Link inválido')
        setStatus('erro')
        return
      }

      setUser(data.user)
      setStatus('sucesso')
      toast.success('Login feito com sucesso!')

      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch {
      setError('Erro ao verificar link')
      setStatus('erro')
    }
  }

  return (
    <div className="page-container flex items-center justify-center p-4 min-h-screen">
      <div className="max-w-md w-full text-center">
        {status === 'verificando' && (
          <div>
            <div className="w-16 h-16 border-4 border-warmth-300 border-t-warmth-500 rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-cozy-800">Verificando seu link...</h1>
            <p className="text-cozy-400 mt-2">Só um instante</p>
          </div>
        )}

        {status === 'sucesso' && (
          <div>
            <span className="text-6xl block mb-4">✅</span>
            <h1 className="text-2xl font-bold text-cozy-800">Login realizado!</h1>
            <p className="text-cozy-400 mt-2">Redirecionando...</p>
          </div>
        )}

        {status === 'erro' && (
          <div>
            <span className="text-6xl block mb-4">❌</span>
            <h1 className="text-2xl font-bold text-cozy-800">Link inválido</h1>
            <p className="text-cozy-500 mt-2 mb-6">{error}</p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="btn-primary">Tentar novamente</Link>
              <Link href="/register" className="btn-outline">Criar conta</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
