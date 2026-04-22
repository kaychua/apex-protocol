import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, Plus, Trash2, Target, Star,
         CheckCircle2, Circle, Zap, Pencil, Check, X } from 'lucide-react'

const PALETTE = [
  'var(--neon-cyan)', 'var(--neon-magenta)', 'var(--neon-purple)',
  'var(--neon-green)', 'var(--neon-amber)',
]

const DEFAULT_CATEGORIES = {
  'Pole Foundations': {
    color: 'var(--neon-cyan)',
    tricks: [
      { id: 'pf1', name: 'Fireman Spin', level: 'beginner' },
      { id: 'pf2', name: 'Front Hook Spin', level: 'beginner' },
      { id: 'pf3', name: 'Chair Spin', level: 'beginner' },
      { id: 'pf4', name: 'Body Wave', level: 'intermediate' },
      { id: 'pf5', name: 'Pole Sit', level: 'intermediate' },
      { id: 'pf6', name: 'Crucifix', level: 'intermediate' },
      { id: 'pf7', name: 'Twisted Grip Ayesha', level: 'advanced' },
      { id: 'pf8', name: 'Handspring', level: 'advanced' },
      { id: 'pf9', name: 'Deadlift Ayesha', level: 'elite' },
      { id: 'pf10', name: 'Iron X', level: 'elite' },
    ]
  },
  'Elite Flex Tricks': {
    color: 'var(--neon-magenta)',
    tricks: [
      { id: 'ef1', name: 'Jade Split', level: 'intermediate' },
      { id: 'ef2', name: 'Butterfly', level: 'intermediate' },
      { id: 'ef3', name: 'Allegra', level: 'advanced' },
      { id: 'ef4', name: 'Janeiro', level: 'advanced' },
      { id: 'ef5', name: 'Needle Scale', level: 'advanced' },
      { id: 'ef6', name: 'Cocoon', level: 'elite' },
      { id: 'ef7', name: 'Titanic', level: 'elite' },
      { id: 'ef8', name: 'Brass Monkey', level: 'elite' },
    ]
  },
  'Contortion': {
    color: 'var(--neon-purple)',
    tricks: [
      { id: 'co1', name: 'Standing Backbend', level: 'beginner' },
      { id: 'co2', name: 'Front Splits (L)', level: 'beginner' },
      { id: 'co3', name: 'Front Splits (R)', level: 'beginner' },
      { id: 'co4', name: 'Middle Splits', level: 'intermediate' },
      { id: 'co5', name: 'Over-Splits (L)', level: 'intermediate' },
      { id: 'co6', name: 'Over-Splits (R)', level: 'intermediate' },
      { id: 'co7', name: 'Standing Needle', level: 'advanced' },
      { id: 'co8', name: 'Chest Stand', level: 'advanced' },
      { id: 'co9', name: 'Needle Point', level: 'elite' },
      { id: 'co10', name: 'Scorpion (Standing)', level: 'elite' },
    ]
  }
}

const LEVEL_STYLES = {
  beginner:     { color: 'var(--neon-green)',   label: 'Foundation', bg: 'var(--neon-green-dim)' },
  intermediate: { color: 'var(--neon-cyan)',    label: 'Developing', bg: 'var(--neon-cyan-dim)' },
  advanced:     { color: 'var(--neon-amber)',   label: 'Advanced',   bg: 'var(--neon-amber-dim)' },
  elite:        { color: 'var(--neon-magenta)', label: 'Elite',      bg: 'var(--neon-magenta-dim)' },
}

function loadCategories() {
  try {
    const s = localStorage.getItem('skillCategories')
    return s ? JSON.parse(s) : DEFAULT_CATEGORIES
  } catch { return DEFAULT_CATEGORIES }
}

function saveCategories(data) {
  localStorage.setItem('skillCategories', JSON.stringify(data))
}

// ── Inline editable trick row ─────────────────────────────────────────────────
function TrickRow({ trick, catColor, mastered, onToggle, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(trick.name)
  const [level, setLevel] = useState(trick.level)
  const lvl = LEVEL_STYLES[trick.level]

  const commit = () => { onSave({ ...trick, name, level }); setEditing(false) }
  const cancel = () => { setName(trick.name); setLevel(trick.level); setEditing(false) }

  if (editing) {
    return (
      <motion.div layout style={{ display: 'flex', gap: 6, padding: '6px 8px', borderRadius: 10,
        background: 'rgba(255,255,255,0.8)', border: `1px solid ${catColor}`, marginBottom: 4, flexWrap: 'wrap' }}>
        <input className="input" style={{ flex: 2, minWidth: 120, fontSize: 13, padding: '5px 10px' }}
          value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel() }} autoFocus />
        <select className="input" style={{ flex: 1, minWidth: 110, fontSize: 12, padding: '5px 8px' }}
          value={level} onChange={e => setLevel(e.target.value)}>
          {Object.entries(LEVEL_STYLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={commit} style={{ background: catColor, border: 'none', borderRadius: 8,
            width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Check size={13} />
          </button>
          <button onClick={cancel} style={{ background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: 8,
            width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <X size={13} />
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 10,
        background: mastered ? `${catColor}08` : 'rgba(255,255,255,0.5)',
        border: `1px solid ${mastered ? catColor : 'var(--border)'}`, marginBottom: 4 }}>
      <div onClick={onToggle} style={{ cursor: 'pointer', flexShrink: 0 }}>
        {mastered
          ? <CheckCircle2 size={16} style={{ color: catColor }} />
          : <Circle size={16} style={{ color: 'var(--text-muted)' }} />}
      </div>
      <span onClick={onToggle} style={{ flex: 1, fontSize: 14, fontWeight: 500, cursor: 'pointer',
        color: mastered ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{trick.name}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: lvl.color, background: lvl.bg,
        padding: '2px 7px', borderRadius: 10 }}>{lvl.label}</span>
      <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none',
        cursor: 'pointer', color: 'var(--text-muted)', padding: 2, flexShrink: 0, opacity: 0.6 }}>
        <Pencil size={11} />
      </button>
      <button onClick={onDelete} style={{ background: 'none', border: 'none',
        cursor: 'pointer', color: 'var(--text-muted)', padding: 2, flexShrink: 0, opacity: 0.6 }}>
        <Trash2 size={11} />
      </button>
    </motion.div>
  )
}

// ── Category branch ───────────────────────────────────────────────────────────
function CategoryBranch({ name, data, mastered, onToggle, onUpdateTrick, onDeleteTrick, onAddTrick }) {
  const [open, setOpen] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newTrick, setNewTrick] = useState({ name: '', level: 'intermediate' })

  const pct = data.tricks.length
    ? Math.round((data.tricks.filter(t => mastered[t.id]).length / data.tricks.length) * 100) : 0

  const handleAdd = () => {
    if (!newTrick.name.trim()) return
    onAddTrick({ id: `c_${Date.now()}`, name: newTrick.name.trim(), level: newTrick.level })
    setNewTrick({ name: '', level: 'intermediate' })
    setShowAdd(false)
  }

  return (
    <motion.div layout style={{ marginBottom: 10 }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)',
        border: `1px solid ${data.color}30`, borderRadius: 14, cursor: 'pointer', userSelect: 'none' }}>
        <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: data.color }}>{name}</span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>
          {data.tricks.filter(t => mastered[t.id]).length}/{data.tricks.length}
        </span>
        <div style={{ width: 44, height: 4, background: 'var(--bg-deep)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: data.color, borderRadius: 2, transition: 'width 0.4s' }} />
        </div>
        {open ? <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
               : <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', paddingLeft: 8,
              paddingTop: 6, borderLeft: `2px solid ${data.color}25`, marginLeft: 12 }}>
            {data.tricks.map(trick => (
              <TrickRow key={trick.id} trick={trick} catColor={data.color}
                mastered={!!mastered[trick.id]}
                onToggle={() => onToggle(trick.id)}
                onSave={(updated) => onUpdateTrick(trick.id, updated)}
                onDelete={() => onDeleteTrick(trick.id)} />
            ))}

            {/* Inline add form */}
            <AnimatePresence>
              {showAdd && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: 6, padding: '6px 0', flexWrap: 'wrap' }}>
                    <input className="input" style={{ flex: 2, minWidth: 140, fontSize: 13 }}
                      placeholder="Trick name…" value={newTrick.name}
                      onChange={e => setNewTrick(p => ({ ...p, name: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleAdd()} autoFocus />
                    <select className="input" style={{ flex: 1, minWidth: 110, fontSize: 12 }}
                      value={newTrick.level} onChange={e => setNewTrick(p => ({ ...p, level: e.target.value }))}>
                      {Object.entries(LEVEL_STYLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <button className="btn btn-cyan" style={{ fontSize: 12, padding: '6px 12px' }} onClick={handleAdd}>
                      <Plus size={12} /> Add
                    </button>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => setShowAdd(false)}>
                      <X size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showAdd && (
              <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center',
                gap: 6, marginTop: 4, marginBottom: 6, background: 'none',
                border: `1px dashed ${data.color}50`, borderRadius: 10, padding: '6px 12px',
                cursor: 'pointer', width: '100%', color: data.color, fontSize: 12,
                fontWeight: 600, fontFamily: 'var(--font-body)', opacity: 0.8 }}>
                <Plus size={12} /> Add trick to {name}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Goal row with inline editing ──────────────────────────────────────────────
function GoalRow({ goal, onSave, onDelete, onToggleDone }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: goal.name, source: goal.source || '', notes: goal.notes || '' })

  const commit = () => { onSave({ ...goal, ...form }); setEditing(false) }
  const cancel = () => { setForm({ name: goal.name, source: goal.source || '', notes: goal.notes || '' }); setEditing(false) }

  if (editing) {
    return (
      <motion.div layout className="card" style={{ marginBottom: 8, borderColor: 'var(--neon-cyan)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input className="input" placeholder="Trick name" value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))} autoFocus />
          <input className="input" placeholder="Source / where you saw it" value={form.source}
            onChange={e => setForm(p => ({ ...p, source: e.target.value }))} />
          <textarea className="input" placeholder="Notes…" value={form.notes}
            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-cyan" onClick={commit}><Check size={13} /> Save</button>
            <button className="btn btn-ghost" onClick={cancel}>Cancel</button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      className="card" style={{ marginBottom: 8, borderColor: goal.done ? 'var(--neon-green)' : 'var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div onClick={onToggleDone} style={{ cursor: 'pointer', paddingTop: 2 }}>
          {goal.done ? <CheckCircle2 size={18} style={{ color: 'var(--neon-green)' }} />
                     : <Circle size={18} style={{ color: 'var(--text-muted)' }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15,
            color: goal.done ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: goal.done ? 'line-through' : 'none' }}>{goal.name}</div>
          {goal.source && <div style={{ fontSize: 12, color: 'var(--neon-cyan)', marginTop: 2 }}>
            Source: {goal.source}</div>}
          {goal.notes && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{goal.notes}</div>}
        </div>
        <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--text-muted)', padding: 4, flexShrink: 0 }}>
          <Pencil size={13} />
        </button>
        <button onClick={onDelete} style={{ background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--text-muted)', padding: 4, flexShrink: 0 }}>
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function SkillTree() {
  const [categories, setCategories] = useState(loadCategories)
  const [mastered, setMastered] = useState(() => {
    try { return JSON.parse(localStorage.getItem('skillMastered') || '{}') } catch { return {} }
  })
  const [goals, setGoals] = useState(() => {
    try { return JSON.parse(localStorage.getItem('goalList') || '[]') } catch { return [] }
  })
  const [tab, setTab] = useState('tree')
  const [newGoal, setNewGoal] = useState({ name: '', notes: '', source: '' })
  const [showGoalForm, setShowGoalForm] = useState(false)

  const persistCats = (data) => { setCategories(data); saveCategories(data) }

  const toggleMaster = (id) => {
    const next = { ...mastered, [id]: !mastered[id] }
    if (!next[id]) delete next[id]
    setMastered(next)
    localStorage.setItem('skillMastered', JSON.stringify(next))
  }

  const updateTrick = (catName, trickId, updated) => {
    const next = { ...categories }
    next[catName] = { ...next[catName], tricks: next[catName].tricks.map(t => t.id === trickId ? updated : t) }
    persistCats(next)
  }

  const deleteTrick = (catName, trickId) => {
    const next = { ...categories }
    next[catName] = { ...next[catName], tricks: next[catName].tricks.filter(t => t.id !== trickId) }
    const m = { ...mastered }; delete m[trickId]
    setMastered(m); localStorage.setItem('skillMastered', JSON.stringify(m))
    persistCats(next)
  }

  const addTrick = (catName, trick) => {
    const next = { ...categories }
    next[catName] = { ...next[catName], tricks: [...next[catName].tricks, trick] }
    persistCats(next)
  }

  const saveGoals = (data) => { setGoals(data); localStorage.setItem('goalList', JSON.stringify(data)) }
  const addGoal = () => {
    if (!newGoal.name.trim()) return
    saveGoals([...goals, { ...newGoal, id: Date.now(), done: false }])
    setNewGoal({ name: '', notes: '', source: '' }); setShowGoalForm(false)
  }

  const totalTricks = Object.values(categories).reduce((a, c) => a + c.tricks.length, 0)
  const totalMastered = Object.values(mastered).filter(Boolean).length

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Mastered', value: totalMastered, color: 'var(--neon-cyan)' },
          { label: 'Total', value: totalTricks, color: 'var(--text-secondary)' },
          { label: 'Goals', value: goals.length, color: 'var(--neon-magenta)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '10px 8px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'rgba(255,255,255,0.6)',
        padding: 4, borderRadius: 14, border: '1px solid var(--border)' }}>
        {[{ id: 'tree', label: 'Skill Tree', icon: <Zap size={12} /> },
          { id: 'goals', label: 'Goal List', icon: <Target size={12} /> }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 0', borderRadius: 10,
            border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700,
            fontSize: 12, background: tab === t.id ? 'rgba(255,255,255,0.9)' : 'transparent',
            color: tab === t.id ? 'var(--neon-cyan)' : 'var(--text-secondary)',
            boxShadow: tab === t.id ? '0 2px 8px rgba(224,71,158,0.1)' : 'none',
            transition: 'all 0.2s' }}>
            {t.icon} {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'tree' ? (
          <motion.div key="tree" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {Object.entries(categories).map(([name, data]) => (
              <CategoryBranch key={name} name={name} data={data} mastered={mastered}
                onToggle={toggleMaster}
                onUpdateTrick={(id, updated) => updateTrick(name, id, updated)}
                onDeleteTrick={(id) => deleteTrick(name, id)}
                onAddTrick={(trick) => addTrick(name, trick)} />
            ))}
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Add or rename categories in the Settings tab
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div key="goals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <button className="btn btn-magenta" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
              onClick={() => setShowGoalForm(s => !s)}>
              <Plus size={15} /> Add to Goal List
            </button>
            <AnimatePresence>
              {showGoalForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 12 }}>
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, borderColor: 'var(--neon-magenta)' }}>
                    <input className="input" placeholder="Trick name" value={newGoal.name}
                      onChange={e => setNewGoal(p => ({ ...p, name: e.target.value }))} autoFocus />
                    <input className="input" placeholder="Source / where you saw it" value={newGoal.source}
                      onChange={e => setNewGoal(p => ({ ...p, source: e.target.value }))} />
                    <textarea className="input" placeholder="Notes…" value={newGoal.notes}
                      onChange={e => setNewGoal(p => ({ ...p, notes: e.target.value }))} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-magenta" onClick={addGoal}><Plus size={13} /> Save</button>
                      <button className="btn btn-ghost" onClick={() => setShowGoalForm(false)}>Cancel</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {goals.length === 0
              ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <Star size={28} style={{ marginBottom: 8, opacity: 0.3 }} />
                  <p style={{ fontSize: 14 }}>No goals yet.</p>
                </div>
              : goals.map(goal => (
                  <GoalRow key={goal.id} goal={goal}
                    onSave={(updated) => saveGoals(goals.map(g => g.id === goal.id ? updated : g))}
                    onDelete={() => saveGoals(goals.filter(g => g.id !== goal.id))}
                    onToggleDone={() => saveGoals(goals.map(g => g.id === goal.id ? { ...g, done: !g.done } : g))} />
                ))
            }
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
