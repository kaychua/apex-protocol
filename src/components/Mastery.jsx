import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Skull, ArrowLeft, ArrowRight, CheckCircle2, Circle, AlertTriangle, Star } from 'lucide-react'

const TRICK_CATEGORIES = ['Pole Foundations', 'Spinning Pole', 'Static Pole', 'Exotic / Floorwork', 'Contortion', 'Transitions', 'Drops', 'Inversions']

function SideToggle({ side, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
      border: `1px solid ${active ? color : 'var(--border)'}`,
      background: active ? `${color}20` : 'transparent',
      color: active ? color : 'var(--text-muted)',
      fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
      letterSpacing: '0.08em', transition: 'all 0.15s',
    }}>
      {side === 'L' ? <ArrowLeft size={11} /> : <ArrowRight size={11} />}
      {side}
    </button>
  )
}

function TrickCard({ trick, onToggleSide, onToggleNemesis, onDelete }) {
  const bothSides = trick.leftDone && trick.rightDone
  const isUneven = trick.leftDone !== trick.rightDone
  const statusColor = bothSides ? 'var(--neon-green)' : isUneven ? 'var(--neon-amber)' : 'var(--text-muted)'

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="card" style={{
        marginBottom: 8,
        borderColor: trick.nemesis ? 'rgba(244,63,106,0.4)' : bothSides ? 'var(--neon-green)' : isUneven ? 'rgba(249,112,102,0.4)' : 'var(--border)',
        background: trick.nemesis ? 'rgba(244,63,106,0.04)' : 'var(--bg-card)',
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{trick.name}</span>
            {trick.nemesis && <Skull size={14} style={{ color: 'var(--neon-magenta)' }} />}
            {isUneven && !trick.nemesis && <AlertTriangle size={13} style={{ color: 'var(--neon-amber)' }} />}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <SideToggle side="L" active={trick.leftDone}
              color={trick.leftDone ? 'var(--neon-cyan)' : 'var(--text-muted)'}
              onClick={() => onToggleSide('left')} />
            <SideToggle side="R" active={trick.rightDone}
              color={trick.rightDone ? 'var(--neon-magenta)' : 'var(--text-muted)'}
              onClick={() => onToggleSide('right')} />
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>{trick.category}</span>
          </div>
          {trick.notes && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, paddingLeft: 8,
              borderLeft: '2px solid var(--border)' }}>{trick.notes}</div>
          )}
          {isUneven && (
            <div style={{ fontSize: 11, color: 'var(--neon-amber)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={10} /> BAD SIDE: {trick.leftDone ? 'Right needs work' : 'Left needs work'}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button onClick={() => onToggleNemesis()} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            color: trick.nemesis ? 'var(--neon-magenta)' : 'var(--text-muted)',
          }} title="Add to Nemesis list">
            <Skull size={15} />
          </button>
          <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-muted)' }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {/* Side progress bar */}
      <div style={{ display: 'flex', gap: 2, marginTop: 8, height: 3 }}>
        <div style={{ flex: 1, borderRadius: 1, background: trick.leftDone ? 'var(--neon-cyan)' : 'var(--bg-deep)', transition: 'background 0.3s' }} />
        <div style={{ flex: 1, borderRadius: 1, background: trick.rightDone ? 'var(--neon-magenta)' : 'var(--bg-deep)', transition: 'background 0.3s' }} />
      </div>
    </motion.div>
  )
}

export default function Mastery() {
  const [tricks, setTricks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('masteryTricks') || '[]') } catch { return [] }
  })
  const [showForm, setShowForm] = useState(false)
  const [newTrick, setNewTrick] = useState({ name: '', category: TRICK_CATEGORIES[0], notes: '' })
  const [view, setView] = useState('all')

  const save = (data) => { setTricks(data); localStorage.setItem('masteryTricks', JSON.stringify(data)) }

  const addTrick = () => {
    if (!newTrick.name.trim()) return
    save([...tricks, { ...newTrick, id: Date.now(), leftDone: false, rightDone: false, nemesis: false }])
    setNewTrick({ name: '', category: TRICK_CATEGORIES[0], notes: '' })
    setShowForm(false)
  }

  const update = (id, changes) => save(tricks.map(t => t.id === id ? { ...t, ...changes } : t))

  const nemesisTricks = tricks.filter(t => t.nemesis)
  const unevenTricks = tricks.filter(t => t.leftDone !== t.rightDone && !t.nemesis)
  const mastered = tricks.filter(t => t.leftDone && t.rightDone)

  const displayed = view === 'nemesis' ? nemesisTricks
    : view === 'bad' ? unevenTricks
    : tricks

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Both Sides', value: mastered.length, color: 'var(--neon-green)' },
          { label: 'Nemesis', value: nemesisTricks.length, color: 'var(--neon-magenta)' },
          { label: 'Uneven', value: unevenTricks.length, color: 'var(--neon-amber)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center', padding: '10px 8px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Nemesis warning */}
      {nemesisTricks.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="card" style={{ marginBottom: 12, borderColor: 'rgba(244,63,106,0.35)', background: 'rgba(244,63,106,0.05)', padding: '10px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Skull size={16} style={{ color: 'var(--neon-magenta)', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: 'var(--neon-magenta)', fontWeight: 700, letterSpacing: '0.08em' }}>NEMESIS LIST — NEXT SESSION PRIORITIES</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>
                {nemesisTricks.map(t => t.name).join(' · ')}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* View tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, background: 'var(--bg-card)', padding: 4, borderRadius: 8, border: '1px solid var(--border)' }}>
        {[
          { id: 'all', label: `All (${tricks.length})` },
          { id: 'nemesis', label: `Nemesis (${nemesisTricks.length})` },
          { id: 'bad', label: `Bad Side (${unevenTricks.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em',
            background: view === t.id ? (t.id === 'nemesis' ? 'rgba(255,50,50,0.15)' : t.id === 'bad' ? 'var(--neon-amber-dim)' : 'var(--neon-purple-dim)') : 'transparent',
            color: view === t.id ? (t.id === 'nemesis' ? 'var(--neon-magenta)' : t.id === 'bad' ? 'var(--neon-amber)' : 'var(--neon-purple)') : 'var(--text-secondary)',
            transition: 'all 0.2s',
          }}>{t.label.toUpperCase()}</button>
        ))}
      </div>

      {/* Add button */}
      <button className="btn btn-purple" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
        onClick={() => setShowForm(s => !s)}>
        <Plus size={15} /> ADD TRICK ENTRY
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 12 }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, borderColor: 'var(--neon-purple)' }}>
              <input className="input" placeholder="Trick name" value={newTrick.name}
                onChange={e => setNewTrick(p => ({ ...p, name: e.target.value }))} />
              <select className="input" value={newTrick.category}
                onChange={e => setNewTrick(p => ({ ...p, category: e.target.value }))}>
                {TRICK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea className="input" placeholder="Notes — cues, corrections, feeling..." value={newTrick.notes}
                onChange={e => setNewTrick(p => ({ ...p, notes: e.target.value }))} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-purple" onClick={addTrick}><Plus size={13} /> ADD TRICK</button>
                <button className="btn btn-ghost" onClick={() => setShowForm(false)}>CANCEL</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {displayed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          {view === 'nemesis' ? <Skull size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
            : <Star size={32} style={{ marginBottom: 8, opacity: 0.3 }} />}
          <p style={{ fontSize: 14 }}>
            {view === 'nemesis' ? 'No nemesis tricks — keep crushing it.'
              : view === 'bad' ? 'Both sides looking even!'
              : 'Add tricks to track mastery.'}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {displayed.map(trick => (
            <TrickCard
              key={trick.id}
              trick={trick}
              onToggleSide={(side) => update(trick.id, { [`${side}Done`]: !trick[`${side}Done`] })}
              onToggleNemesis={() => update(trick.id, { nemesis: !trick.nemesis })}
              onDelete={() => save(tricks.filter(t => t.id !== trick.id))}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  )
}
