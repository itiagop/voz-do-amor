import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import { PWARegister } from './pwa-register'
import './globals.css'

export const metadata: Metadata = {
  title: 'Voz Que Fica',
  description: 'A voz dos seus pais contando histórias pra sempre',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Voz Que Fica',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FF6B35',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {/* Navbar divertida */}
        <nav className="navbar">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300 inline-block">📚</span>
              <span className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] via-[#FF6B9D] to-[#A78BFA] bg-clip-text text-transparent">
                Voz Que Fica
              </span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="navbar-link">
                Início
              </Link>
              <Link href="/books" className="navbar-link">
                Livros
              </Link>
              <Link href="/login" className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white font-bold px-5 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                Entrar
              </Link>
            </div>
          </div>
        </nav>

        {children}

        {/* Footer */}
        <footer className="relative z-10 text-center py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] via-[#FF6B9D] to-[#A78BFA] bg-clip-text text-transparent">Voz Que Fica</span>
              <span className="text-2xl">💛</span>
            </div>
            <p className="text-[#A0897A] text-xs">Comunica Myrna enterprise.</p>
          </div>
        </footer>

        <PWARegister />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '16px',
              background: '#333',
              color: '#fff',
              fontSize: '16px',
              padding: '16px 24px',
            },
          }}
        />
      </body>
    </html>
  )
}
