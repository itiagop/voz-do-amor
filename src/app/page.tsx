import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="page-container min-h-screen">
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-20">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="text-6xl md:text-8xl block">📚</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-gradient mb-4">
            Voz Que Fica
          </h1>
          <p className="text-xl md:text-2xl text-cozy-600 max-w-2xl mx-auto leading-relaxed">
            A voz dos seus pais, avós, padrinhos contando histórias
            <br />
            <strong>para sempre</strong>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="card p-8 text-center">
            <span className="text-4xl block mb-4">🎙️</span>
            <h3 className="text-xl font-bold text-cozy-800 mb-3">1. Grave</h3>
            <p className="text-cozy-500">
              Mãe, pai, avô, avó — cada um grava sua voz lendo as histórias
            </p>
          </div>
          <div className="card p-8 text-center">
            <span className="text-4xl block mb-4">💾</span>
            <h3 className="text-xl font-bold text-cozy-800 mb-3">2. Guarde</h3>
            <p className="text-cozy-500">
              A voz fica salva pra sempre, vinculada a cada página do livro
            </p>
          </div>
          <div className="card p-8 text-center">
            <span className="text-4xl block mb-4">🎧</span>
            <h3 className="text-xl font-bold text-cozy-800 mb-3">3. Ouça</h3>
            <p className="text-cozy-500">
              A criança ouve a voz de quem ama, quando quiser, quantas vezes quiser
            </p>
          </div>
        </div>

        {/* Depoimento emocional */}
        <div className="bg-white/60 backdrop-blur rounded-3xl p-8 md:p-12 mb-16 max-w-3xl mx-auto text-center shadow-lg border border-warmth-100">
          <span className="text-5xl block mb-4">💛</span>
          <p className="text-lg md:text-xl text-cozy-600 italic leading-relaxed mb-6">
            "Meu pai mora longe. Ele grava as histórias e minha filha ouve a voz do avô toda noite.
            <br />Mesmo quando ele não está aqui, a voz dele fica."
          </p>
          <p className="font-semibold text-cozy-800">— Uma história real</p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/register" className="btn-primary text-xl px-12 py-5 rounded-full inline-block shadow-xl hover:shadow-2xl">
            Começar grátis
          </Link>
          <p className="text-cozy-400 mt-4 text-sm">
            7 dias grátis • Depois R$19,90/mês • Cancele quando quiser
          </p>
          <div className="mt-4">
            <Link href="/login" className="text-warmth-500 hover:underline font-semibold">
              Já tenho conta
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-cozy-300 text-xs">
        <p>Voz Que Fica — A voz de quem ama, contando histórias pra sempre.</p>
      </footer>
    </div>
  )
}
