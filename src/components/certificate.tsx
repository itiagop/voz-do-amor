'use client'

import { motion } from 'framer-motion'

type CertificateProps = {
  bookTitle: string
  readerName: string
  childName?: string
  onClose?: () => void
}

export function Certificate({ bookTitle, readerName, childName, onClose }: CertificateProps) {
  const date = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto"
    >
      <div
        id="certificate"
        className="relative bg-gradient-to-br from-[#FFF5F0] to-[#FFF0F6] dark:from-[#1E1E2E] dark:to-[#2E1E3E] rounded-[2rem] p-[3px] shadow-2xl"
      >
        {/* Border gradient */}
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[#FFD93D] via-[#FF6B35] via-[#FF6B9D] to-[#A78BFA] opacity-50" />

        {/* Content */}
        <div className="relative bg-white dark:bg-[#1E1E2E] rounded-[2rem] p-8 md:p-10 text-center overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 text-2xl opacity-30">⭐</div>
          <div className="absolute top-4 right-4 text-2xl opacity-30">🌟</div>
          <div className="absolute bottom-4 left-4 text-2xl opacity-30">✨</div>
          <div className="absolute bottom-4 right-4 text-2xl opacity-30">💫</div>

          {/* Top decoration */}
          <div className="w-16 h-1 bg-gradient-to-r from-[#FF6B35] to-[#FF6B9D] mx-auto mb-6 rounded-full" />

          <span className="text-6xl block mb-4">🏆</span>

          <h2 className="text-2xl md:text-3xl font-bold text-[#4A3728] dark:text-[#E8E0D8] mb-2">
            Certificado de Conclusão
          </h2>

          <p className="text-[#A0897A] dark:text-[#8A7E70] text-sm mb-6">
            Este certificado é concedido a
          </p>

          <div className="bg-gradient-to-r from-[#FFF5F0] to-[#FFF0F6] dark:from-[#16162A] dark:to-[#1A162E] rounded-2xl p-6 mb-6">
            <p className="text-3xl font-bold text-gradient-warm mb-1">
              {readerName}
            </p>
            <p className="text-[#6B5744] dark:text-[#C4B8A8] text-sm">
              pela gravação completa do livro
            </p>
            <p className="text-xl font-bold text-[#4A3728] dark:text-[#E8E0D8] mt-2">
              &ldquo;{bookTitle}&rdquo;
            </p>
            {childName && (
              <p className="text-[#A0897A] dark:text-[#8A7E70] text-sm mt-2">
                dedicado a <strong className="text-[#FF6B35]">{childName}</strong>
              </p>
            )}
          </div>

          <p className="text-[#A0897A] dark:text-[#8A7E70] text-xs mb-4">
            {date}
          </p>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-8 h-px bg-[#FFE4D6] dark:bg-[#2E2E42]" />
            <span className="text-xs text-[#A0897A] dark:text-[#8A7E70]">💛 Voz Que Fica</span>
            <span className="w-8 h-px bg-[#FFE4D6] dark:bg-[#2E2E42]" />
          </div>

          <p className="text-xs text-[#B8A89A] dark:text-[#6A5E50]">
            A voz de quem ama, contando histórias pra sempre
          </p>

          <div className="w-16 h-1 bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D] mx-auto mt-6 rounded-full" />
        </div>
      </div>

      {onClose && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="btn-outline flex-1 text-sm py-3"
          >
            Fechar
          </button>
        </div>
      )}
    </motion.div>
  )
}
