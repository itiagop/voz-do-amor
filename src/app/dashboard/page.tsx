'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useUserStore } from '@/lib/store'

interface Reader {
  id: string
  name: string
  avatar: string | null
  relation: string | null
  createdAt: string
}

interface Child {
  id: string
  name: string
  avatar: string | null
  age: number | null
  color: string
}

interface BadgeData {
  slug: string
  name: string
  description: string
  icon: string
  earned: boolean
}

interface EarnedBadge {
  badge: { slug: string; name: string; description: string; icon: string }
  earnedAt: string
}

interface Gamification {
  streak: { currentStreak: number; longestStreak: number; lastRecordDate: string | null }
  badges: EarnedBadge[]
  allBadges: BadgeData[]
  stats: { totalRecordings: number; totalDuration: number; totalBooks: number; completedBooks: number; daysStreak: number }
}

interface Book {
  id: string
  title: string
  author: string
  description: string
  pageCount: number
  category: string
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  const hrs = Math.floor(mins / 60)
  const remMins = mins % 60
  return remMins > 0 ? `${hrs}h ${remMins}m` : `${hrs}h`
}

function getStreakMilestone(current: number): { next: number; progress: number } {
  if (current >= 100) return { next: current, progress: 100 }
  const milestones = [3, 7, 14, 30, 60, 100]
  const next = milestones.find(m => m > current) ?? milestones[milestones.length - 1]
  const prev = milestones.filter(m => m <= current).pop() ?? 0
  const progress = next > prev ? ((current - prev) / (next - prev)) * 100 : 100
  return { next, progress }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } },
}

const avatars = ['👴', '👵', '👨', '👩', '🧑', '👱‍♀️', '👱‍♂️']

const COLORS = ['#FF6B35', '#45B7D1', '#A78BFA', '#FF6B9D', '#51CF66', '#FFD93D', '#FF8C42']

function getInitialAvatar(name: string): string {
  return avatars[name.length % avatars.length]
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, setUser } = useUserStore()
  const [loading, setLoading] = useState(true)
  const [gamification, setGamification] = useState<Gamification | null>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [readers, setReaders] = useState<Reader[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [greeting, setGreeting] = useState('')
  const [greetingEmoji, setGreetingEmoji] = useState('☀️')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) { setGreeting('Bom dia'); setGreetingEmoji('🌅') }
    else if (hour < 18) { setGreeting('Boa tarde'); setGreetingEmoji('☀️') }
    else { setGreeting('Boa noite'); setGreetingEmoji('🌙') }
  }, [])

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    try {
      const [meRes, gamRes, credRes, booksRes, readersRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/gamification'),
        fetch('/api/credits'),
        fetch('/api/books'),
        fetch('/api/readers'),
      ])

      if (!meRes.ok) { router.push('/login'); return }

      const meData = await meRes.json()
      setUser({ id: meData.id, name: meData.name, email: meData.email, role: meData.role })

      if (gamRes.ok) setGamification(await gamRes.json())
      if (credRes.ok) { const d = await credRes.json(); setCredits(d.credits ?? d.balance ?? 0) }
      if (booksRes.ok) { const d = await booksRes.json(); setBooks(Array.isArray(d) ? d : d.books ?? []) }
      if (readersRes.ok) { const d = await readersRes.json(); setReaders(d.readers ?? []); setChildren(d.children ?? []) }
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const streak = gamification?.stats.daysStreak ?? gamification?.streak?.currentStreak ?? 0
  const longestStreak = gamification?.streak?.longestStreak ?? 0
  const totalRecordings = gamification?.stats.totalRecordings ?? 0
  const totalDuration = gamification?.stats.totalDuration ?? 0
  const totalBooks = gamification?.stats.totalBooks ?? 0
  const completedBooks = gamification?.stats.completedBooks ?? 0
  const badges = gamification?.allBadges ?? []
  const earnedBadges = gamification?.badges ?? []
  const { next: nextMilestone, progress: streakProgress } = getStreakMilestone(streak)
  const hasReaders = readers.length > 0 || children.length > 0
  const allPeople = [...readers.map(r => ({ id: r.id, name: r.name, type: 'reader' as const, relation: r.relation })),
    ...children.map(c => ({ id: c.id, name: c.name, type: 'child' as const, age: c.age, color: c.color }))]

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="w-20 h-20 rounded-full border-4 border-[#FFE4D6] border-t-[#FF6B35] mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
            className="text-[#A0897A] text-lg font-medium"
          >
            Carregando seu painel...
          </motion.p>
          <div className="mt-6 flex gap-1.5 justify-center">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: i === 0 ? '#FF6B35' : i === 1 ? '#45B7D1' : '#A78BFA' }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container p-4 md:p-8 relative overflow-hidden">
      <div className="bubble w-72 h-72 bg-[#FF6B35] opacity-[0.06] top-[-10%] left-[-8%]" style={{ animationDelay: '0s' }} />
      <div className="bubble w-56 h-56 bg-[#45B7D1] opacity-[0.05] top-[15%] right-[-6%]" style={{ animationDelay: '1.5s' }} />
      <div className="bubble w-44 h-44 bg-[#A78BFA] opacity-[0.05] bottom-[20%] left-[-5%]" style={{ animationDelay: '3s' }} />
      <div className="bubble w-32 h-32 bg-[#FFD93D] opacity-[0.04] bottom-[5%] right-[10%]" style={{ animationDelay: '2s' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Family Section - Readers & Children */}
          {hasReaders && (
            <motion.section variants={itemVariants} className="mb-8">
              <div className="card-fun p-6 md:p-8 bg-gradient-to-br from-[#FFF5F0] to-[#FFF0F5] dark:from-[#1a1a2e] dark:to-[#16213e] border-2 border-[#FFD93D]/30 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFD93D] opacity-[0.08] rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl float-emoji">👨‍👩‍👧‍👦</span>
                    <div>
                      <h2 className="text-2xl font-bold text-[#4A3728] dark:text-[#E8E0D8]">
                        Sua Família
                      </h2>
                      <p className="text-[#A0897A] text-sm">
                        Pessoas que você ama e que vão ouvir suas histórias
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {readers.map((reader, i) => (
                      <motion.div
                        key={reader.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ y: -4, scale: 1.05 }}
                        className="bg-white/80 dark:bg-[#1E1E2E]/80 rounded-2xl p-4 text-center shadow-sm hover:shadow-lg transition-all border border-[#FFE4D6]/50"
                      >
                        <div className="text-3xl mb-2">{getInitialAvatar(reader.name)}</div>
                        <p className="font-bold text-sm text-[#4A3728] dark:text-[#E8E0D8] truncate">
                          {reader.name}
                        </p>
                        {reader.relation && (
                          <p className="text-[10px] text-[#A78BFA] font-semibold">{reader.relation}</p>
                        )}
                      </motion.div>
                    ))}
                    {children.map((child, i) => (
                      <motion.div
                        key={child.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (readers.length + i) * 0.06 }}
                        whileHover={{ y: -4, scale: 1.05 }}
                        className="rounded-2xl p-4 text-center shadow-sm hover:shadow-lg transition-all border-2"
                        style={{
                          backgroundColor: child.color + '15',
                          borderColor: child.color + '40',
                        }}
                      >
                        <div className="text-3xl mb-2">
                          {child.age && child.age <= 3 ? '👶' : child.age && child.age <= 10 ? '🧒' : '👧'}
                        </div>
                        <p className="font-bold text-sm text-[#4A3728] dark:text-[#E8E0D8] truncate">
                          {child.name}
                        </p>
                        {child.age != null && (
                          <p className="text-[10px] font-semibold" style={{ color: child.color }}>
                            {child.age} {child.age === 1 ? 'ano' : 'anos'}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href="/readers"
                      className="inline-flex items-center gap-1 text-sm font-bold text-[#A78BFA] hover:text-[#FF6B35] transition-colors"
                    >
                      + Adicionar familiar
                    </Link>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {!hasReaders && (
            <motion.section variants={itemVariants} className="mb-8">
              <div className="card-fun p-6 md:p-10 text-center relative overflow-hidden bg-gradient-to-br from-[#FFF5F0] to-[#FFF0F5] dark:from-[#1a1a2e] dark:to-[#16213e] border-2 border-[#FF6B35]/20 border-dashed">
                <div className="relative z-10">
                  <motion.span
                    className="text-6xl block mb-4"
                    animate={{ y: [0, -8, 0], rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    👨‍👩‍👧‍👦
                  </motion.span>
                  <h3 className="text-2xl font-bold text-gradient mb-3">
                    Quem vai ouvir suas histórias?
                  </h3>
                  <p className="text-[#A0897A] mb-6 max-w-lg mx-auto">
                    Adicione seus familiares — filhos, netos, sobrinhos — para começar a criar
                    histórias cheias de amor que ficarão guardadas para sempre.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mb-4">
                    {['👴 Vovô', '👵 Vovó', '👨 Papai', '👩 Mamãe', '👦 Filho', '👧 Filha', '👶 Bebê'].map((item) => (
                      <span key={item} className="bg-white/80 dark:bg-[#1E1E2E]/80 px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-[#FFE4D6]/50">
                        {item}
                      </span>
                    ))}
                  </div>
                  <Link href="/readers" className="btn-primary inline-flex items-center gap-2 py-3 px-8 text-base">
                    ➕ Adicionar Familiar
                  </Link>
                </div>
              </div>
            </motion.section>
          )}

          {/* Header */}
          <motion.header variants={itemVariants} className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 mb-1"
                >
                  <span className="text-sm font-semibold tracking-wide text-[#A78BFA] uppercase">
                    {greeting} {greetingEmoji}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD93D]" />
                  <span className="text-sm font-medium text-[#A0897A]">
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).replace('-feira', '')}
                  </span>
                </motion.div>
                <h1 className="text-3xl md:text-5xl font-bold">
                  <span className="text-gradient">
                    Olá, {user?.name?.split(' ')[0] ?? 'família'}! 💛
                  </span>
                </h1>
                <p className="text-[#A0897A] mt-1.5 text-lg">
                  {hasReaders
                    ? `${allPeople.length} ${allPeople.length === 1 ? 'pessoa espera' : 'pessoas esperam'} por suas histórias`
                    : 'Crie memórias que aquecem o coração'}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {user?.role === 'admin' && (
                  <Link href="/admin" className="badge-sun hover:scale-105 transition-transform px-4 py-2 text-sm font-bold">
                    ⚡ Admin
                  </Link>
                )}

                {credits !== null && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    className="glass rounded-2xl px-5 py-2.5 flex items-center gap-2.5 border border-[#FFE4D6]/40"
                  >
                    <span className="text-lg">💎</span>
                    <div>
                      <p className="text-xs text-[#A0897A] font-medium leading-tight">Créditos</p>
                      <p className="text-lg font-bold text-gradient">{credits}</p>
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' })
                    setUser(null)
                    router.push('/login')
                  }}
                  className="text-[#A0897A] hover:text-[#FF6B35] transition-colors text-sm font-semibold ml-1"
                >
                  Sair
                </button>
              </div>
            </div>
          </motion.header>

          {/* Stats Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Dias Seguidos', value: streak, emoji: '🔥', max: longestStreak, sub: `Recorde: ${longestStreak}`, color: '#FF6B35' },
              { label: 'Gravações', value: totalRecordings, emoji: '🎤', sub: totalRecordings === 0 ? 'Nenhuma ainda' : `${totalRecordings} ao todo`, color: '#45B7D1' },
              { label: 'Tempo de Áudio', value: formatDuration(totalDuration), emoji: '⏱️', sub: totalDuration > 0 ? 'Tempo total' : 'Comece agora!', color: '#A78BFA' },
              { label: 'Livros Completos', value: completedBooks, emoji: '📖', sub: totalBooks > 0 ? `${totalBooks} no total` : 'Explore a biblioteca', color: '#FFD93D' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -6, scale: 1.02 }}
                className="card-fun p-5 relative overflow-hidden group"
              >
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-700"
                  style={{ backgroundColor: item.color, opacity: 0.08 }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{item.emoji}</span>
                  </div>
                  <p className="text-3xl md:text-4xl font-extrabold" style={{ color: item.color }}>{item.value}</p>
                  <p className="text-sm text-[#A0897A] font-medium mt-0.5">{item.label}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-[#A0897A]">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.sub}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Badges */}
          <motion.section variants={itemVariants} className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="section-title flex items-center gap-2">🏅 Conquistas da Família</h2>
                <p className="text-[#A0897A] text-sm">
                  {earnedBadges.length} de {badges.length} conquistadas
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.slug}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.04, type: 'spring', stiffness: 100 }}
                  whileHover={badge.earned ? { scale: 1.08, y: -4 } : { scale: 1.02 }}
                  className={`card p-4 text-center relative ${badge.earned
                    ? 'bg-white hover:shadow-xl hover:shadow-[#FFD93D]/20 cursor-pointer'
                    : 'bg-white/50 opacity-55 cursor-default'
                  } transition-all duration-300`}
                >
                  {badge.earned && (
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-[#FFD93D] to-[#FF6B35] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <span className="text-[10px]">⭐</span>
                    </div>
                  )}
                  <motion.span
                    className={`text-3xl block mb-2 ${badge.earned ? '' : 'grayscale'}`}
                    animate={badge.earned ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] } : {}}
                    transition={badge.earned ? { duration: 2, repeat: Infinity, repeatDelay: 5 } : {}}
                  >
                    {badge.icon}
                  </motion.span>
                  <h3 className={`text-xs font-extrabold uppercase tracking-wide ${badge.earned ? 'text-[#4A3728]' : 'text-[#A0897A]'}`}>
                    {badge.name}
                  </h3>
                  <p className={`text-[10px] mt-0.5 ${badge.earned ? 'text-[#A0897A]' : 'text-[#C4B5A7]'}`}>
                    {badge.earned ? badge.description : '🔒 Ainda não'}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Quick Actions */}
          <motion.section variants={itemVariants} className="mb-10">
            <h2 className="section-title mb-4">⚡ Ações Rápidas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { href: '/books', emoji: '🎙️', label: 'Gravar História', sub: 'Escolha um livro', color: '#FF6B35' },
                { href: '/books', emoji: '📚', label: 'Ver Livros', sub: 'Explore a biblioteca', color: '#45B7D1' },
                { href: '/readers', emoji: '👨‍👩‍👧‍👦', label: 'Minha Família', sub: 'Gerencie seus familiares', color: '#A78BFA' },
                { emoji: '📤', label: 'Compartilhar', sub: 'Divulgue para amigos', color: '#FF6B9D', action: () => {
                  if (navigator.share) {
                    navigator.share({ title: 'Voz Que Fica', text: 'Crie histórias personalizadas para crianças! 🎧', url: window.location.href })
                  } else {
                    navigator.clipboard.writeText(window.location.href).then(() => toast.success('🔗 Link copiado!'))
                  }
                }},
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03, y: -3 }}>
                  {item.action ? (
                    <button onClick={item.action} className="glass rounded-2xl p-5 flex flex-col items-center gap-2 text-center group border border-[#FFE4D6]/30 hover:shadow-lg transition-all w-full"
                      style={{ borderColor: item.color }}>
                      <span className="text-3xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                      <span className="font-bold text-[#4A3728] dark:text-[#E8E0D8] text-sm">{item.label}</span>
                      <span className="text-[10px] text-[#A0897A]">{item.sub}</span>
                    </button>
                  ) : (
                    <Link href={item.href} className="glass rounded-2xl p-5 flex flex-col items-center gap-2 text-center group border border-[#FFE4D6]/30 hover:shadow-lg transition-all block"
                      style={{ borderColor: item.color }}>
                      <span className="text-3xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                      <span className="font-bold text-[#4A3728] dark:text-[#E8E0D8] text-sm">{item.label}</span>
                      <span className="text-[10px] text-[#A0897A]">{item.sub}</span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Books */}
          <motion.section variants={itemVariants} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="section-title flex items-center gap-2">📚 Biblioteca</h2>
                <p className="text-[#A0897A] text-sm">Histórias para gravar com amor</p>
              </div>
              <Link href="/books" className="btn-primary text-xs py-2.5 px-5">Ver todos →</Link>
            </div>

            {books.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {books.slice(0, 4).map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Link href={`/books/${book.id}`} className="card-fun p-5 block h-full group">
                      <div className="flex flex-col h-full">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFD93D] flex items-center justify-center text-white text-lg mb-3 group-hover:scale-110 transition-transform">📖</div>
                        <h3 className="font-bold text-[#4A3728] dark:text-[#E8E0D8] text-sm leading-tight mb-1 line-clamp-2">{book.title}</h3>
                        {book.author && <p className="text-[11px] text-[#A0897A] mb-2">{book.author}</p>}
                        {book.description && <p className="text-[11px] text-[#A0897A]/70 leading-relaxed line-clamp-2 flex-1">{book.description}</p>}
                        <div className="mt-3 flex items-center gap-2 text-[10px]">
                          <span className="bg-[#FFF0E6] text-[#FF6B35] font-bold px-2.5 py-1 rounded-full">{book.category ?? 'Geral'}</span>
                          <span className="text-[#A0897A]">{book.pageCount} págs</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-fun p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/5 via-transparent to-[#45B7D1]/5" />
                <div className="relative z-10">
                  <motion.span className="text-6xl block mb-4" animate={{ y: [0, -6, 0], rotate: [0, -3, 3, 0] }} transition={{ duration: 3, repeat: Infinity }}>🚀</motion.span>
                  <h3 className="text-2xl font-bold text-gradient mb-2">Comece agora!</h3>
                  <p className="text-[#A0897A] mb-6 max-w-md mx-auto">Escolha um livro e grave uma história cheia de amor para quem você ama.</p>
                  <Link href="/books" className="btn-primary inline-flex items-center gap-2 py-3 px-8 text-base">📚 Explorar Biblioteca →</Link>
                </div>
              </motion.div>
            )}
          </motion.section>

          {/* Family Tip */}
          <motion.section variants={itemVariants} className="glass rounded-[2rem] p-6 md:p-8 border border-[#FFE4D6]/30">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <motion.span className="text-5xl block" animate={{ rotate: [0, -8, 8, -8, 0], scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}>🎧</motion.span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">Dica do Dia 💕</h3>
                <p className="text-[#A0897A] text-sm leading-relaxed">
                  A voz de quem ama é o presente mais precioso. Cada história gravada se torna uma
                  memória que atravessa o tempo — vovó, vovô, papai, mamãe... a voz de quem ama fica
                  para sempre no coração de quem ouve.
                </p>
              </div>
              <div className="flex -space-x-2">
                {['👴', '👵', '👨', '👩'].map((emoji, i) => (
                  <motion.div
                    key={i}
                    className="text-2xl"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          <div className="h-12" />
        </motion.div>
      </div>
    </div>
  )
}
