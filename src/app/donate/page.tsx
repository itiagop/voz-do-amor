'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DonatePage() {
  const [pixKey, setPixKey] = useState('')

  useEffect(() => {
    fetch('/api/settings?key=pix_key')
      .then((r) => r.json())
      .then((data) => {
        if (data.value) setPixKey(data.value)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="page-container flex items-center justify-center p-4 min-h-[80vh]">
      <div className="max-w-lg w-full relative z-10">
        <Link href="/" className="text-[#A0897A] hover:text-[#FF6B35] font-semibold mb-6 inline-block transition-colors">
          ← Voltar
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 md:p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <span className="text-7xl block mb-6">💛</span>
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Ajude o Voz Que Fica
          </h1>

          <p className="text-[#6B5744] dark:text-[#C4B8A8] text-lg leading-relaxed mb-6">
            Sua doação mantém esse projeto vivo, permitindo que mais famílias
            criem memórias que ficam para sempre através da voz de quem amam.
          </p>

          <div className="bg-gradient-to-br from-[#FFF5F0] to-[#FFF0F6] dark:from-[#16162A] dark:to-[#1A162E] rounded-2xl p-6 mb-6">
            <p className="text-sm text-[#A0897A] mb-2">Chave PIX</p>
            {pixKey ? (
              <div className="space-y-3">
                <p className="text-xl font-bold text-[#4A3728] dark:text-[#E8E0D8] font-mono break-all">
                  {pixKey}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(pixKey)
                  }}
                  className="btn-primary text-sm py-2 px-6"
                >
                  📋 Copiar chave
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-4xl block mb-2">🔜</span>
                <p className="text-[#A0897A]">
                  Chave PIX sendo configurada em breve!
                </p>
                <p className="text-xs text-[#B8A89A]">
                  O administrador ainda não cadastrou a chave PIX.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3 text-left text-sm text-[#6B5744] dark:text-[#C4B8A8] leading-relaxed">
            <p>💛 <strong>Seu apoio faz a diferença!</strong> Com sua contribuição, podemos:</p>
            <ul className="space-y-1.5 pl-5">
              <li>✨ Manter os servidores funcionando</li>
              <li>📚 Adicionar mais livros e histórias</li>
              <li>🎙️ Melhorar a qualidade das gravações</li>
              <li>🌟 Desenvolver novas funcionalidades</li>
              <li>💝 Oferecer o serviço para famílias que não podem pagar</li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-[#FFE4D6] dark:border-[#2E2E42]">
            <p className="text-xs text-[#B8A89A]">
              Com carinho, equipe Voz Que Fica 💛
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
