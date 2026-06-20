'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useUserStore } from '@/lib/store'

export default function RegisterPage() {
  const router = useRouter()
  const { setUser } = useUserStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'senha' | 'magic'>('senha')
  const [magicSent, setMagicSent] = useState(false)
  const [magicUrl, setMagicUrl] = useState('')

  async function handlePasswordRegister(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Senhas não conferem')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erro ao cadastrar')
        return
      }

      setUser(data.user)
      toast.success('Conta criada com sucesso! 🎉')
      router.push('/dashboard')
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  async function handleMagicRegister() {
    if (!name || !email) {
      toast.error('Preencha nome e email')
      return
    }
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: Math.random().toString(36) }),
      })

      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Erro'); return }

      setUser(data.user)

      const magicRes = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const magicData = await magicRes.json()
      if (magicRes.ok) {
        setMagicSent(true)
        setMagicUrl(magicData.magicUrl)
        toast.success('Conta criada! Clique no link para entrar ⚡')
      } else {
        toast.success('Conta criada! 🎉')
        router.push('/dashboard')
      }
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container flex items-center justify-center p-4 min-h-[80vh]">
      {/* Decorative bubbles */}
      <div className="bubble w-40 h-40 bg-[#FF6B35] opacity-5 top-10 left-[-5%]" style={{ animationDelay: '0s' }} />
      <div className="bubble w-28 h-28 bg-[#45B7D1] opacity-5 bottom-20 right-[-3%]" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="text-6xl block mb-3">📚</span>
            <h1 className="text-4xl font-bold text-gradient mb-2">Voz Que Fica</h1>
          </Link>
          <p className="text-[#6B5744] text-lg mt-2">Comece a criar memórias que duram pra sempre 💛</p>
        </div>

        <div className="card p-8 md:p-10">
          {magicSent ? (
            <div className="text-center">
              <span className="text-5xl block mb-4">🎉</span>
              <h2 className="text-2xl font-bold text-[#4A3728] mb-2">Conta criada!</h2>
              <p className="text-[#A0897A] mb-6">Clique no link abaixo para entrar:</p>
              <a href={magicUrl} className="btn-primary w-full inline-block text-center mb-4">
                Entrar no Voz Que Fica ⚡
              </a>
              <button onClick={() => router.push('/dashboard')} className="link-fun text-sm">
                Ir para o painel
              </button>
            </div>
          ) : (
            <>
              <div className="flex mb-6 bg-[#FFF5F0] rounded-xl p-1">
                <button onClick={() => setMode('senha')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'senha' ? 'bg-white shadow-sm text-[#4A3728]' : 'text-[#A0897A]'}`}>🔑 Senha</button>
                <button onClick={() => setMode('magic')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'magic' ? 'bg-white shadow-sm text-[#4A3728]' : 'text-[#A0897A]'}`}>⚡ Link Mágico</button>
              </div>

              {mode === 'magic' ? (
                <>
                  <h2 className="text-2xl font-bold text-[#4A3728] mb-2">Criar conta rápida</h2>
                  <p className="text-[#A0897A] mb-8">Sem senha, só nome e email</p>
                  <div className="space-y-5">
                    <div>
                      <label className="input-label">Seu nome</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className="input-field" placeholder="Como você se chama?" required />
                    </div>
                    <div>
                      <label className="input-label">Email</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="input-field" placeholder="seu@email.com" required />
                    </div>
                    <button onClick={handleMagicRegister} disabled={loading}
                      className="btn-primary w-full text-lg">
                      {loading ? '⏳ Criando...' : 'Criar conta ⚡'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#4A3728] mb-2">Criar conta</h2>
                  <p className="text-[#A0897A] mb-8">É rapidinho e gratuito por 7 dias! 🎉</p>
                  <form onSubmit={handlePasswordRegister} className="space-y-5">
                    <div>
                      <label className="input-label">Seu nome</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className="input-field" placeholder="Como você se chama?" required />
                    </div>
                    <div>
                      <label className="input-label">Email</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="input-field" placeholder="seu@email.com" required />
                    </div>
                    <div>
                      <label className="input-label">Senha</label>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="input-field" placeholder="Mínimo 6 caracteres" minLength={6} required />
                    </div>
                    <div>
                      <label className="input-label">Confirmar senha</label>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field" placeholder="Digite a senha novamente" minLength={6} required />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full text-lg">
                      {loading ? '⏳ Criando...' : 'Criar conta 🎉'}
                    </button>
                  </form>
                </>
              )}

              <p className="text-center mt-6 text-[#A0897A]">
                Já tem conta? <Link href="/login" className="link-fun">Entrar</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
