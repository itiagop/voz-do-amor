import type { Metadata, Viewport } from 'next'
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
  themeColor: '#ec7d1a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
        <div className="text-center py-3 text-xs text-cozy-300 border-t border-warmth-100 bg-white/50">
          Comunica Myrna enterprise.
        </div>
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
