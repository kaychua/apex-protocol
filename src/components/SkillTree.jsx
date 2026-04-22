import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, Plus, Trash2, Target, Star, CheckCircle2, Circle, Zap, Pencil } from 'lucide-react'

const INITIAL_TREE = {
  'Pole Foundations': {
    color: 'var(--neon-cyan)',
    icon: '⚡',
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
    icon: '🌸',
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
    icon: '🔮',
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
  beginner:     { color: 'var(--neon-green)',   label: 'FOUNDATION', bg: 'var(--neon-green-dim)' },
  intermediate: { color: 'var(--neon-cyan)',    label: 'DEVELOPING', bg: 'var(--neon-cyan-dim)' },
  advanced:     { color: 'var(--neon-amber)',   label: 'ADVANCED',   bg: 'var(--neon-amber-dim)' },
  elite:        { color: 'var(--neon-magenta)', label: 'ELITE',      bg: 'var(--neon-magenta-dim)' },
}

function TrickItem({ trick, catColor, mastered, onToggle, onDelete, isCustom }) {
  const lvl = LEVEL_STYLES[trick.level]
  return (
    <motion.div layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 10px', borderRadius: 10,
        background: mastered ? `${catColor}08` : 'rgba(255,255,255,0.5)',
        border: `1px solid ${mastered ? catColor : 'var(--border)'}`,
        marginBottom: 4,
      }}>
      <div onClick={onToggle} style={{ cursor: 'pointer', flexShrink: 0 }}>
        {mastered
          ? <CheckCircle2 size={16} style={{ color: catColor }} />
          : <Circle size={16} style={{ color: 'var(--text-muted)' }} />}
      </div>
      <span onClick={onToggle} style={{
        flex: 1, fontSize: 14, fontWeight: 500, cursor: 'pointer',
        color: mastered ? 'var(--text-primary)' : 'var(--text-secondary)',
      }}>{trick.name}</span>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
        color: lvl.color, background: lvl.bg,
        padding: '2px 7px', borderRadius: 10,
      }}>{lvl.label}</span>
      {isCustom && (
        <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-muted)', flexShrink: 0 }}>
          <Trash2 size={12} />
        </button>
      )}
    </motion.div>
  )
}

function CategoryBranch({ name, data, mastered, onToggle, customItems, onAddCustom, onDeleteCustom }) {
  const [open, setOpen] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTrick, setNewTrick] = useState({ name: '', level: 'intermediate' })

  const allTricks = [...data.tricks, ...customItems]
  const masteredCount = allTricks.filter(t => mastered[t.id]).length
  const pct = Math.round((masteredCount / allTricks.length) * 100)

  const handleAdd = () => {
    if (!newTrick.name.trim()) return
    onAddCustom({ id: `custom_${Date.now()}`, name: newTrick.name.trim(), level: newTrick.level })
    setNewTrick({ name: '', level: 'intermediate' })
    setShowAddForm(false)
  }

  return (
    <motion.div layout style={{ marginBottom: 10 }}>
      {/* Category header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
        background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)',
        border: `1px solid ${data.color}30`, borderRadius: 14, cursor: 'pointer', userSelect: 'none',
      }} onClick={() => setOpen(o => !o)}>
        <span style={{ fontSize: 18 }}>{data.icon}</span>
        <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: data.color }}>{name}</span>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700 }}>{masteredCount}/{allTricks.length}</span>
        <div style={{ width: 50, height: 4, background: 'var(--bg-deep)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: data.color, borderRadius: 2, transition: 'width 0.4s' }} />
        </div>
        {open ? <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
               : <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', paddingLeft: 8, paddingTop: 6, borderLeft: `2px solid ${data.color}25`, marginLeft: 12 }}>
            {allTricks.map(trick => (
              <TrickItem key={trick.id} trick={trick} catColor={data.color}
                mastered={!!mastered[trick.id]}
                onToggle={() => onToggle(trick.id)}
                isCustom={trick.id.startsWith('custom_')}
                onDelete={() => onDeleteCustom(trick.id)} />
            ))}

            {/* Add trick inline form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: 6, padding: '8px 0', flexWrap: 'wrap' }}>
                    <input className="input" style={{ flex: 2, minWidth: 140, fontSize: 13 }}
                      placeholder="Trick name..." value={newTrick.name}
                      onChange={e => setNewTrick(p => ({ ...p, name: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleAdd()} autoFocus />
                    <select className="input" style={{ flex: 1, minWidth: 110, fontSize: 12 }}
                      value={newTrick.level} onChange={e => setNewTrick(p => ({ ...p, level: e.target.value }))}>
                      <option value="beginner">Foundation</option>
                      <option value="intermediate">Developing</option>
                      <option value="advanced">Advanced</option>
                      <option value="elite">Elite</option>
                    </select>
                    <button className="btn btn-cyan" style={{ fontSize: 12, padding: '6px 12px' }} onClick={handleAdd}>
                      <Plus size={12} /> Add
                    </button>
                    <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => setShowAddForm(false)}>✕</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add trick button */}
            {!showAddForm && (
              <button onClick={() => setShowAddForm(true)} style={{
                display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 6,
                background: 'none', border: `1px dashed ${data.color}50`, borderRadius: 10,
                padding: '6px 12px', cursor: 'pointer', width: '100%',
                color: data.color, fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)',
                opacity: 0.8,
              }}>
                <Plus size={12} /> Add trick to {name}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function SkillTree() {
  const [mastered, setMastered] = useState(() => {
    try { return JSON.parse(localStorage.getItem('skillMastered') || '{}') } catch { return {} }
  })
  const [customTricks, setCustomTricks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customTricks') || '{}') } catch { return {} }
  })
  const [goals, setGoals] = useState(() => {
    try { return JSON.parse(localStorage.getItem('goalList') || '[]') } catch { return [] }
  })
  const [tab, setTab] = useState('tree')
  const [newGoal, setNewGoal] = useState({ name: '', notes: '', source: '' })
  const [showForm, setShowForm] = useState(false)

  const toggleMaster = (id) => {
    const next = { ...mastered, [id]: !mastered[id] }
    if (!next[id]) delete next[id]
    setMastered(next)
    localStorage.setItem('skillMastered', JSON.stringify(next))
  }

  const addCustomTrick = (categoryName, trick) => {
    const next = { ...customTricks, [categoryName]: [...(customTricks[categoryName] || []), trick] }
    setCustomTricks(next)
    localStorage.setItem('customTricks', JSON.stringify(next))
  }

  const deleteCustomTrick = (categoryName, trickId) => {
    const next = { ...customTricks, [categoryName]: (customTricks[categoryName] || []).filter(t => t.id !== trickId) }
    setCustomTricks(next)
    localStorage.setItem('customTricks', JSON.stringify(next))
    const m = { ...mastered }; delete m[trickId]
    setMastered(m); localStorage.setItem('skillMastered', JSON.stringify(m))
  }

  const addGoal = () => {
    if (!newGoal.name.trim()) return
    const next = [...goals, { ...newGoal, id: Date.now(), done: false }]
    setGoals(next); localStorage.setItem('goalList', JSON.stringify(next))
    setNewGoal({ name: '', notes: '', source: '' }); setShowForm(false)
  }

  const removeGoal = (id) => { const next = goals.filter(g => g.id !== id); setGoals(next); localStorage.setItem('goalList', JSON.stringify(next)) }
  const toggleGoalDone = (id) => { const next = goals.map(g => g.id === id ? { ...g, done: !g.done } : g); setGoals(next); localStorage.setItem('goalList', JSON.stringify(next)) }

  const totalCustom = Object.values(customTricks).reduce((a, v) => a + v.length, 0)
  const totalTricks = Object.values(INITIAL_TREE).reduce((a, c) => a + c.tricks.length, 0) + totalCustom
  const totalMastered = Object.values(mastered).filter(Boolean).length

  return (
    <div style={{ padding: '0 0 80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Mastered', value: totalMastered, color: 'var(--neon-cyan)' },
          { label: 'Total', value: totalTricks, color: 'var(--text-secondary)' },
          { label: 'Goals', value: goals.length, color: 'var(--neon-magenta)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '10px 8px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'rgba(255,255,255,0.6)', padding: 4, borderRadius: 14, border: '1px solid var(--border)' }}>
        {[{ id: 'tree', label: 'Skill Tree', icon: <Zap size={13} /> }, { id: 'goals', label: 'Goal List', icon: <Target size={13} /> }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, letterSpacing: '0.05em',
            background: tab === t.id ? 'rgba(255,255,255,0.9)' : 'transparent',
            color: tab === t.id ? 'var(--neon-cyan)' : 'var(--text-secondary)',
            boxShadow: tab === t.id ? '0 2px 8px rgba(224,71,158,0.1)' : 'none',
            transition: 'all 0.2s',
          }}>{t.icon} {t.label.toUpperCase()}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'tree' ? (
          <motion.div key="tree" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {Object.entries(INITIAL_TREE).map(([name, data]) => (
              <CategoryBranch key={name} name={name} data={data} mastered={mastered} onToggle={toggleMaster}
                customItems={customTricks[name] || []}
                onAddCustom={(trick) => addCustomTrick(name, trick)}
                onDeleteCustom={(id) => deleteCustomTrick(name, id)} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="goals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <button className="btn btn-magenta" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
              onClick={() => setShowForm(s => !s)}>
              <Plus size={15} /> ADD TRICK TO GOAL LIST
            </button>
            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginBottom: 12 }}>
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, borderColor: 'var(--neon-magenta)' }}>
                    <input className="input" placeholder="Trick name (e.g. Ballerina Split Grip)" value={newGoal.name}
                      onChange={e => setNewGoal(p => ({ ...p, name: e.target.value }))} />
                    <input className="input" placeholder="Source / where you saw it" value={newGoal.source}
                      onChange={e => setNewGoal(p => ({ ...p, source: e.target.value }))} />
                    <textarea className="input" placeholder="Notes — why you want this, what's needed..." value={newGoal.notes}
                      onChange={e => setNewGoal(p => ({ ...p, notes: e.target.value }))} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-magenta" onClick={addGoal}><Plus size={13} /> SAVE GOAL</button>
                      <button className="btn btn-ghost" onClick={() => setShowForm(false)}>CANCEL</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {goals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <Star size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
                <p style={{ fontSize: 14 }}>No goals yet. Add tricks you discover online.</p>
              </div>
            ) : (
              goals.map(goal => (
                <motion.div key={goal.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="card" style={{ marginBottom: 8, borderColor: goal.done ? 'var(--neon-green)' : 'var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div onClick={() => toggleGoalDone(goal.id)} style={{ cursor: 'pointer', paddingTop: 2 }}>
                      {goal.done ? <CheckCircle2 size={18} style={{ color: 'var(--neon-green)' }} />
                                 : <Circle size={18} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15,
                        color: goal.done ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: goal.done ? 'line-through' : 'none' }}>{goal.name}</div>
                      {goal.source && <div style={{ fontSize: 12, color: 'var(--neon-cyan)', marginTop: 2 }}>↗ {goal.source}</div>}
                      {goal.notes && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{goal.notes}</div>}
                    </div>
                    <button className="btn btn-danger" style={{ padding: '4px 8px' }} onClick={() => removeGoal(goal.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
