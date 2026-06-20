'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useUserStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useUserStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'senha' | 'magic'>('senha')
  const [magicSent, setMagicSent] = useState(false)
  const [magicUrl, setMagicUrl] = useState('')

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erro ao fazer login')
        return
      }

      setUser(data.user)
      toast.success('Bem-vindo de volta!')
      router.push('/dashboard')
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicLink() {
    if (!email) {
      toast.error('Digite seu email')
      return
    }
    setLoading(true)

    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erro ao gerar link')
        return
      }

      setMagicSent(true)
      setMagicUrl(data.magicUrl)
      toast.success('Link mágico gerado!')
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <h1 className="text-5xl font-display font-bold text-gradient mb-2">
              Voz Que Fica
            </h1>
          </Link>
          <p className="text-cozy-600 text-lg mt-3">
            A voz de quem ama, contando histórias pra sempre
          </p>
        </div>

        <div className="card p-8 md:p-10">
          {magicSent ? (
            <div className="text-center">
              <span className="text-5xl block mb-4">🔗</span>
              <h2 className="text-2xl font-bold text-cozy-800 mb-2">Link gerado!</h2>
              <p className="text-cozy-500 mb-6">
                Clique no link abaixo para entrar automaticamente:
              </p>
              <a
                href={magicUrl}
                className="btn-primary w-full inline-block text-center mb-4"
              >
                Entrar no Voz Que Fica
              </a>
              <p className="text-xs text-cozy-400 mb-4">O link expira em 15 minutos</p>
              <button
                onClick={() => setMagicSent(false)}
                className="text-warmth-500 hover:underline text-sm"
              >
                Voltar
              </button>
            </div>
          ) : (
            <>
              <div className="flex mb-6 bg-warmth-50 rounded-xl p-1">
                <button
                  onClick={() => setMode('senha')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    mode === 'senha' ? 'bg-white shadow-sm text-cozy-800' : 'text-cozy-400'
                  }`}
                >
                  Senha
                </button>
                <button
                  onClick={() => setMode('magic')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    mode === 'magic' ? 'bg-white shadow-sm text-cozy-800' : 'text-cozy-400'
                  }`}
                >
                  Link Mágico ⚡
                </button>
              </div>

              {mode === 'magic' ? (
                <>
                  <h2 className="text-2xl font-bold text-cozy-800 mb-2">Entrar sem senha</h2>
                  <p className="text-cozy-500 mb-8">Receba um link mágico no seu email</p>

                  <div className="space-y-5">
                    <div>
                      <label className="input-label">Seu email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>

                    <button
                      onClick={handleMagicLink}
                      disabled={loading}
                      className="btn-primary w-full text-lg"
                    >
                      {loading ? 'Gerando...' : 'Enviar link mágico ⚡'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-cozy-800 mb-2">Entrar</h2>
                  <p className="text-cozy-500 mb-8">Que bom ter você de volta!</p>

                  <form onSubmit={handlePasswordLogin} className="space-y-5">
                    <div>
                      <label className="input-label">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="input-label">Senha</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full text-lg"
                    >
                      {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                  </form>
                </>
              )}

              <p className="text-center mt-6 text-cozy-500">
                Ainda não tem conta?{' '}
                <Link href="/register" className="text-warmth-500 font-semibold hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
