'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useUserStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useUserStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

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
      toast.success('Bem-vindo de volta! 👋')
      router.push('/dashboard')
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container flex items-center justify-center p-4 min-h-[80vh] relative overflow-hidden">
      {/* Bolhas decorativas flutuando */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-[#FF6B35]/10 to-transparent top-[-10%] left-[-10%]"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-56 h-56 rounded-full bg-gradient-to-br from-[#45B7D1]/10 to-transparent bottom-[-8%] right-[-8%]"
          animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-[#A78BFA]/10 to-transparent top-[30%] right-[-5%]"
          animate={{ x: [0, -15, 0], y: [0, 25, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-[#FF6B9D]/10 to-transparent bottom-[20%] left-[-5%]"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Estrelas decorativas */}
      <div className="absolute top-12 left-[15%] text-2xl opacity-20 float-emoji">⭐</div>
      <div className="absolute top-24 right-[20%] text-xl opacity-15 float-emoji" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute bottom-32 left-[25%] text-lg opacity-20 float-emoji" style={{ animationDelay: '2s' }}>🌟</div>
      <div className="absolute bottom-20 right-[15%] text-2xl opacity-15 float-emoji" style={{ animationDelay: '0.5s' }}>💫</div>

      <div className="w-full max-w-md relative z-10">
        {/* Header decorado */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="inline-block group">
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-7xl block mb-3 bounce-in">📚</span>
            </motion.div>
          </Link>
          <h1 className="text-5xl font-bold text-gradient mb-3">
            Voz Que Fica
          </h1>
          <p className="text-[#6B5744] text-lg">
            A voz de quem ama, contando histórias pra sempre <span className="inline-block float-emoji">💛</span>
          </p>
        </motion.div>

        {/* Card de login */}
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl p-8 md:p-10 border border-[#FFE4D6] relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Top decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF6B35] via-[#FF6B9D] via-[#A78BFA] to-[#45B7D1]" />

          <div className="relative">
            {/* Cabeçalho do formulário */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFF5F0] to-[#FFE4D6] flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-3xl">🔑</span>
              </div>
              <h2 className="text-2xl font-bold text-[#4A3728] mb-1">Bem-vindo de volta!</h2>
              <p className="text-[#A0897A]">Que saudade de você! 👋</p>
            </motion.div>

            {/* Formulário */}
            <motion.form
              onSubmit={handlePasswordLogin}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="space-y-2">
                <label className="input-label">📧 Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="input-label">🔒 Senha</label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg py-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  'Entrar 🎉'
                )}
              </motion.button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#FFE4D6]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-4 text-[#A0897A]">ou</span>
                </div>
              </div>

              <Link
                href="/register"
                className="block w-full text-center py-4 rounded-full border-2 border-[#FF6B35] text-[#FF6B35] font-bold hover:bg-[#FF6B35] hover:text-white transition-all duration-300"
              >
                Criar conta nova ✨
              </Link>
            </motion.form>
          </div>
        </motion.div>

        {/* Footer do card */}
        <motion.p
          className="text-center mt-6 text-[#A0897A] text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          🌟 7 dias grátis • Depois R$19,90/mês
        </motion.p>
      </div>
    </div>
  )
}
