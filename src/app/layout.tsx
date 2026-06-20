import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import { PWARegister } from './pwa-register'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
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
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
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

function Footer() {
  return (
    <footer className="relative z-10 text-center py-6 px-4 border-t border-[#FFE4D6] dark:border-[#2E2E42]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-3">
          <span className="text-2xl">📚</span>
          <span className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] via-[#FF6B9D] to-[#A78BFA] bg-clip-text text-transparent">Voz Que Fica</span>
          <span className="text-2xl">💛</span>
        </div>
        <p className="text-[#A0897A] dark:text-[#6A5E50] text-xs">Comunica Myrna enterprise.</p>
      </div>
    </footer>
  )
}
