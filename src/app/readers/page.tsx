'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Reader {
  id: string
  name: string
  avatar: string | null
  relation: string | null
}

interface Child {
  id: string
  name: string
  avatar: string | null
  age: number | null
  color: string
}

const RELATIONS = ['Vovó', 'Vovô', 'Papai', 'Mamãe', 'Tio', 'Tia', 'Primo', 'Prima', 'Madrinha', 'Padrinho', 'Amigo', 'Outro']
const AVATARS = ['👴', '👵', '👨', '👩', '🧑', '👱‍♀️', '👱‍♂️', '👨‍🦳', '👩‍🦳', '👨‍🦰', '👩‍🦰']
const COLORS = ['#FF6B35', '#45B7D1', '#A78BFA', '#FF6B9D', '#51CF66', '#FFD93D', '#FF8C42', '#20C997', '#E64980', '#7950F2']

export default function ReadersPage() {
  const router = useRouter()
  const [readers, setReaders] = useState<Reader[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'leitor' | 'crianca'>('leitor')

  const [formName, setFormName] = useState('')
  const [formRelation, setFormRelation] = useState('')
  const [formAge, setFormAge] = useState('')
  const [formColor, setFormColor] = useState(COLORS[0])
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const me = await fetch('/api/auth/me')
      if (!me.ok) { router.push('/login'); return }
      const res = await fetch('/api/readers')
      if (res.ok) {
        const d = await res.json()
        setReaders(d.readers ?? [])
        setChildren(d.children ?? [])
      }
    } catch { router.push('/login') }
    finally { setLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) { toast.error('Nome é obrigatório'); return }
    setSaving(true)
    try {
      if (tab === 'leitor') {
        if (editingId) {
          await fetch(`/api/readers/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formName, relation: formRelation }),
          })
          toast.success('Leitor atualizado!')
        } else {
          await fetch('/api/readers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formName, avatar: null, relation: formRelation }),
          })
          toast.success('Leitor adicionado! 🎉')
        }
      } else {
        if (editingId) {
          await fetch(`/api/childs/${editingId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formName, age: formAge, color: formColor }),
          })
          toast.success('Criança atualizada!')
        } else {
          await fetch('/api/childs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formName, age: formAge, color: formColor }),
          })
          toast.success('Criança adicionada! 🎉')
        }
      }
      setFormName(''); setFormRelation(''); setFormAge(''); setFormColor(COLORS[0]); setEditingId(null)
      loadData()
    } catch { toast.error('Erro ao salvar') }
    finally { setSaving(false) }
  }

  async function handleDelete(type: 'reader' | 'child', id: string) {
    if (!confirm('Tem certeza?')) return
    try {
      const url = type === 'reader' ? `/api/readers/${id}` : `/api/childs/${id}`
      await fetch(url, { method: 'DELETE' })
      toast.success('Removido!')
      loadData()
    } catch { toast.error('Erro ao remover') }
  }

  function startEdit(type: 'reader' | 'child', item: any) {
    setTab(type === 'reader' ? 'leitor' : 'crianca')
    setFormName(item.name)
    setFormRelation(item.relation || '')
    setFormAge(item.age?.toString() || '')
    setFormColor(item.color || COLORS[0])
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#FFE4D6] border-t-[#FF6B35] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="page-container p-4 md:p-8 relative overflow-hidden min-h-screen">
      <div className="bubble w-48 h-48 bg-[#A78BFA] opacity-5 top-0 right-[-8%]" />
      <div className="bubble w-32 h-32 bg-[#FFD93D] opacity-5 bottom-0 left-[-5%]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-[#A0897A] hover:text-[#FF6B35] font-semibold mb-6 transition-colors">
          ← Dashboard
        </Link>

        <div className="text-center mb-8">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-6xl block mb-4">👨‍👩‍👧‍👦</motion.span>
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Minha Família</h1>
          <p className="text-[#A0897A]">Adicione quem vai ouvir e gravar suas histórias</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center">
          <button onClick={() => setTab('leitor')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${tab === 'leitor' ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] text-white shadow-lg' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-light)]'}`}>
            🎙️ Leitores
          </button>
          <button onClick={() => setTab('crianca')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${tab === 'crianca' ? 'bg-gradient-to-r from-[#FF6B9D] to-[#E8A0BF] text-white shadow-lg' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-light)]'}`}>
            👶 Crianças
          </button>
        </div>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} className="card p-6 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="font-bold text-[var(--text-primary)] mb-4">
            {editingId ? '✏️ Editar' : '➕ Adicionar'} {tab === 'leitor' ? 'Leitor' : 'Criança'}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Nome</label>
              <input value={formName} onChange={e => setFormName(e.target.value)} className="input-field" placeholder={tab === 'leitor' ? 'Ex: Vovó Maria' : 'Ex: Pedrinho'} />
            </div>
            {tab === 'leitor' ? (
              <div>
                <label className="input-label">Parentesco</label>
                <select value={formRelation} onChange={e => setFormRelation(e.target.value)} className="input-field">
                  <option value="">Selecione...</option>
                  {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label className="input-label">Idade</label>
                <input type="number" value={formAge} onChange={e => setFormAge(e.target.value)} className="input-field" placeholder="Ex: 5" min="0" max="18" />
              </div>
            )}
          </div>
          {tab === 'crianca' && (
            <div className="mt-4">
              <label className="input-label">Cor favorita</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setFormColor(c)}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${formColor === c ? 'border-[#4A3728] scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={saving} className="btn-primary text-sm py-3 px-8">
              {saving ? '⏳ Salvando...' : editingId ? '✏️ Atualizar' : '➕ Adicionar'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormName(''); setFormRelation(''); setFormAge(''); setFormColor(COLORS[0]) }}
                className="btn-outline text-sm py-3 px-6">Cancelar</button>
            )}
          </div>
        </motion.form>

        {/* Readers List */}
        <AnimatePresence mode="wait">
          {tab === 'leitor' && (
            <motion.div key="leitores" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="section-title mb-4">🎙️ Leitores ({readers.length})</h2>
              {readers.length === 0 ? (
                <div className="card p-12 text-center">
                  <span className="text-5xl block mb-4">👴</span>
                  <p className="text-[#A0897A] mb-2">Nenhum leitor cadastrado</p>
                  <p className="text-sm text-[#A0897A]/70">Adicione vovô, vovó, papai, mamãe para gravar histórias</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {readers.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="card p-4 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{AVATARS[i % AVATARS.length]}</div>
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">{r.name}</p>
                          {r.relation && <p className="text-xs text-[#A78BFA] font-semibold">{r.relation}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit('reader', r)} className="text-sm text-[#45B7D1] hover:underline font-bold">Editar</button>
                        <button onClick={() => handleDelete('reader', r.id)} className="text-sm text-red-400 hover:underline font-bold">Remover</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'crianca' && (
            <motion.div key="criancas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="section-title mb-4">👶 Crianças ({children.length})</h2>
              {children.length === 0 ? (
                <div className="card p-12 text-center">
                  <span className="text-5xl block mb-4">👶</span>
                  <p className="text-[#A0897A] mb-2">Nenhuma criança cadastrada</p>
                  <p className="text-sm text-[#A0897A]/70">Adicione filhos, netos, sobrinhos para quem as histórias serão dedicadas</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {children.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="card p-4 flex items-center justify-between group"
                      style={{ borderLeftColor: c.color, borderLeftWidth: 4 }}>
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{c.age && c.age <= 2 ? '👶' : c.age && c.age <= 10 ? '🧒' : '👧'}</div>
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">{c.name}</p>
                          {c.age != null && <p className="text-xs font-semibold" style={{ color: c.color }}>{c.age} {c.age === 1 ? 'ano' : 'anos'}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit('child', c)} className="text-sm text-[#45B7D1] hover:underline font-bold">Editar</button>
                        <button onClick={() => handleDelete('child', c.id)} className="text-sm text-red-400 hover:underline font-bold">Remover</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-[#A0897A] hover:text-[#FF6B35] font-semibold transition-colors">
            ← Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
