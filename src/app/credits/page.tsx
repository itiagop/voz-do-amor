'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const plans = [
  { credits: 5, price: 9.90, popular: false, label: 'Básico', emoji: '🌱' },
  { credits: 15, price: 19.90, popular: true, label: 'Popular', emoji: '⭐' },
  { credits: 30, price: 29.90, popular: false, label: 'Super', emoji: '💎' },
  { credits: 100, price: 69.90, popular: false, label: 'Família', emoji: '👑' },
]

export default function CreditsPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  async function handlePurchase(index: number) {
    setSelected(index)
    setLoading(true)
    const plan = plans[index]
    try {
      const res = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits: plan.credits, amount: plan.price }),
      })
      if (!res.ok) throw new Error()
      toast.success(`🎉 Pedido de ${plan.credits} créditos realizado!`)
      router.push('/dashboard')
    } catch {
      toast.error('Erro ao processar. Tente novamente.')
    } finally {
      setLoading(false)
      setSelected(null)
    }
  }

  return (
    <div className="page-container p-4 md:p-8 relative overflow-hidden min-h-screen">
      <div className="bubble w-96 h-96 bg-[#FFD93D] opacity-[0.04] top-[-20%] right-[-10%]" />
      <div className="bubble w-64 h-64 bg-[#A78BFA] opacity-[0.04] bottom-[-10%] left-[-8%]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-[#A0897A] hover:text-[#FF6B35] font-semibold mb-6 transition-colors">
          ← Dashboard
        </Link>

        <div className="text-center mb-10">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="text-6xl block mb-4">💎</motion.span>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Créditos</h1>
          <p className="text-[#A0897A]">Cada gravação consome 1 crédito. Escolha seu plano:</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`card-fun p-6 text-center relative ${plan.popular ? 'border-[#FFD93D] border-2 ring-2 ring-[#FFD93D]/30' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FFD93D] to-[#FF6B35] text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-lg">
                  MAIS POPULAR
                </div>
              )}
              <span className="text-4xl block mb-3">{plan.emoji}</span>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{plan.label}</h3>
              <p className="text-3xl font-black text-[#FF6B35] mb-1">
                {plan.price.toFixed(2).replace('.', ',')}
                <span className="text-sm text-[#A0897A] font-medium"> R$</span>
              </p>
              <p className="text-sm text-[#A0897A] mb-4">{plan.credits} créditos</p>
              <p className="text-[11px] text-[#A0897A]/70 mb-4">
                {(plan.price / plan.credits).toFixed(2).replace('.', ',')} R$/crédito
              </p>
              <button
                onClick={() => handlePurchase(i)}
                disabled={loading && selected === i}
                className={`w-full py-3 rounded-2xl font-bold text-sm transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF6B9D] text-white shadow-lg hover:shadow-xl'
                    : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-2 border-[var(--border-light)] hover:border-[#FF6B35]/30'
                } ${loading && selected === i ? 'opacity-50 cursor-wait' : ''}`}
              >
                {loading && selected === i ? '⏳...' : '🎯 Escolher'}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="glass p-6 rounded-2xl text-center">
          <p className="text-sm text-[#A0897A]">
            💡 Cada gravação de livro completo consome 1 crédito. 
            Você pode comprar créditos a qualquer momento e eles nunca expiram!
          </p>
        </div>
      </div>
    </div>
  )
}
