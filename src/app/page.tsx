import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="page-container min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative bubbles */}
        <div className="bubble w-32 h-32 bg-[#FF6B35] top-20 left-[10%]" style={{ animationDelay: '0s' }} />
        <div className="bubble w-24 h-24 bg-[#45B7D1] top-40 right-[15%]" style={{ animationDelay: '1s' }} />
        <div className="bubble w-20 h-20 bg-[#A78BFA] top-60 left-[20%]" style={{ animationDelay: '2s' }} />
        <div className="bubble w-28 h-28 bg-[#FF6B9D] top-80 right-[25%]" style={{ animationDelay: '0.5s' }} />
        <div className="bubble w-16 h-16 bg-[#FFD93D] top-32 left-[60%]" style={{ animationDelay: '1.5s' }} />

        <div className="max-w-5xl mx-auto px-4 pt-12 pb-16 relative z-10">
          <div className="text-center mb-12">
            <div className="mb-6">
              <span className="text-7xl md:text-9xl block bounce-in">📚</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-4 bounce-in" style={{ animationDelay: '0.1s' }}>
              Voz Que Fica
            </h1>
            <p className="text-xl md:text-2xl text-[#6B5744] max-w-2xl mx-auto leading-relaxed mb-8 slide-up" style={{ animationDelay: '0.2s' }}>
              A voz dos seus pais, avós, padrinhos contando histórias
              <br />
              <strong className="bg-gradient-to-r from-[#FF6B35] to-[#FF6B9D] bg-clip-text text-transparent">para sempre</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/register" className="btn-primary text-xl px-12 py-5">
                Começar grátis
              </Link>
              <Link href="/login" className="btn-outline text-xl px-12 py-5">
                Já tenho conta
              </Link>
            </div>
            <p className="text-[#A0897A] mt-4 text-sm slide-up" style={{ animationDelay: '0.4s' }}>
              7 dias grátis • Depois R$19,90/mês • Cancele quando quiser
            </p>
          </div>
        </div>
      </div>

      {/* Como funciona */}
      <div className="max-w-5xl mx-auto px-4 pb-20 relative z-10">
        <div className="text-center mb-12">
          <span className="badge-sun mb-4">✨ Como funciona</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#4A3728] mt-4">
            Em três passos mágicos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="card p-8 text-center group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] flex items-center justify-center mx-auto mb-5 text-white text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
              🎙️
            </div>
            <h3 className="text-xl font-bold text-[#4A3728] mb-3">1. Grave</h3>
            <p className="text-[#6B5744] leading-relaxed">
              Mãe, pai, avô, avó, madrinha — cada pessoa especial grava sua voz lendo as páginas com todo carinho
            </p>
          </div>

          <div className="card p-8 text-center group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#45B7D1] to-[#67E8F9] flex items-center justify-center mx-auto mb-5 text-white text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
              💾
            </div>
            <h3 className="text-xl font-bold text-[#4A3728] mb-3">2. Guarde</h3>
            <p className="text-[#6B5744] leading-relaxed">
              A voz fica salva para sempre no livro digital, página por página, como um abraço que nunca acaba
            </p>
          </div>

          <div className="card p-8 text-center group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#C4B5FD] flex items-center justify-center mx-auto mb-5 text-white text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
              🎧
            </div>
            <h3 className="text-xl font-bold text-[#4A3728] mb-3">3. Ouça</h3>
            <p className="text-[#6B5744] leading-relaxed">
              A criança ouve a voz de quem ama quando quiser — na hora de dormir, no colo, quantas vezes quiser
            </p>
          </div>
        </div>

        {/* Depoimento emocionante com visual destacado */}
        <div className="relative max-w-3xl mx-auto mb-16">
          {/* Background decoration */}
          <div className="absolute -top-6 -left-6 text-6xl opacity-20 float-emoji">💛</div>
          <div className="absolute -bottom-6 -right-6 text-6xl opacity-20 float-emoji" style={{ animationDelay: '1s' }}>⭐</div>

          <div className="bg-white/90 backdrop-blur rounded-[2rem] p-8 md:p-12 text-center shadow-xl border border-[#FFE4D6] relative">
            <span className="text-5xl block mb-4">💛</span>
            <p className="text-lg md:text-xl text-[#6B5744] italic leading-relaxed mb-6 font-serif">
              &ldquo;Meu pai mora longe. Ele grava as histórias e minha filha ouve a voz do avô toda noite.
              <br />Mesmo quando ele não está aqui, a voz dele fica.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-[#FFD4C6]" />
              <p className="font-bold text-[#4A3728]">Uma história real</p>
              <span className="w-8 h-px bg-[#FFD4C6]" />
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <div className="inline-block p-[3px] rounded-full bg-gradient-to-r from-[#FF6B35] via-[#FF6B9D] to-[#A78BFA] mb-6">
            <div className="bg-white rounded-full px-8 py-3">
              <span className="text-lg font-bold text-[#4A3728]">
                🌟 Comece agora — é grátis por 7 dias
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-xl px-12 py-5">
              Quero criar histórias
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
