import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, TrendingUp, Dumbbell, Clock, RotateCcw, ChevronDown, ChevronRight, Flame } from 'lucide-react'

const POWER_MOVES = [
  { id: 'iron_x', name: 'Iron X', type: 'hold', unit: 'seconds' },
  { id: 'round_worlds', name: 'Round the Worlds', type: 'reps', unit: 'rotations' },
  { id: 'deadlift', name: 'Deadlift Ayesha', type: 'hold', unit: 'seconds' },
  { id: 'brass_monkey', name: 'Brass Monkey', type: 'hold', unit: 'seconds' },
  { id: 'handspring', name: 'Handspring Mount', type: 'reps', unit: 'clean reps' },
  { id: 'chopper', name: 'Chopper', type: 'reps', unit: 'reps' },
  { id: 'superman', name: 'Superman', type: 'hold', unit: 'seconds' },
  { id: 'flag', name: 'Flag (Human Flag)', type: 'hold', unit: 'seconds' },
]

const CONTORTION_MOVES = [
  { id: 'needle', name: 'Needle Point', type: 'hold', unit: 'seconds' },
  { id: 'oversplit_l', name: 'Over-Split Left', type: 'hold', unit: 'seconds + angle' },
  { id: 'oversplit_r', name: 'Over-Split Right', type: 'hold', unit: 'seconds + angle' },
  { id: 'back_walkover', name: 'Back Walkover', type: 'reps', unit: 'clean reps' },
  { id: 'chest_stand', name: 'Chest Stand', type: 'hold', unit: 'seconds' },
  { id: 'spine_fold', name: 'Full Spine Fold', type: 'hold', unit: 'seconds' },
  { id: 'needle_stand', name: 'Standing Needle', type: 'hold', unit: 'seconds' },
  { id: 'scorpion', name: 'Scorpion', type: 'hold', unit: 'seconds' },
]

function calcTUT(sets) {
  return sets.reduce((total, s) => total + (s.reps || 1) * (s.value || 0), 0)
}

function SetLogger({ move, entries, onAdd, onDelete, onDeleteMove, isCustom }) {
  const [sets, setSets] = useState([{ reps: 3, value: '' }])
  const [open, setOpen] = useState(false)

  const totalTUT = entries.length > 0 ? calcTUT(entries[entries.length - 1].sets || []) : 0

  const addSet = () => setSets(s => [...s, { reps: 3, value: '' }])
  const updateSet = (i, field, val) => setSets(s => s.map((s2, j) => j === i ? { ...s2, [field]: val } : s2))

  const save = () => {
    const valid = sets.filter(s => s.value)
    if (!valid.length) return
    onAdd({ date: new Date().toISOString(), sets: valid, tut: calcTUT(valid) })
    setSets([{ reps: 3, value: '' }])
    setOpen(false)
  }

  return (
    <motion.div layout className="card" style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {move.name}
            {isCustom && <span style={{ fontSize: 10, color: 'var(--neon-cyan)', background: 'var(--neon-cyan-dim)', padding: '1px 6px', borderRadius: 8, fontWeight: 600 }}>CUSTOM</span>}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 8, marginTop: 2 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {move.type === 'hold' ? <Clock size={10} /> : <RotateCcw size={10} />}
              {move.unit}
            </span>
            {totalTUT > 0 && (
              <span style={{ color: 'var(--neon-amber)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Flame size={10} /> TUT: {totalTUT}s
              </span>
            )}
          </div>
        </div>
        {entries.length > 0 && <span style={{ fontSize: 11, color: 'var(--neon-cyan)', fontWeight: 600 }}>{entries.length} sessions</span>}
        {open ? <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
               : <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}>
            <div className="divider" />
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>LOG TODAY</div>
              {sets.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 40, flexShrink: 0 }}>SET {i + 1}</span>
                  {move.type === 'reps' && (
                    <input type="number" className="input" style={{ width: 70 }} placeholder="Reps" value={s.reps}
                      onChange={e => updateSet(i, 'reps', Number(e.target.value))} />
                  )}
                  <input type="number" className="input" style={{ flex: 1 }}
                    placeholder={move.type === 'hold' ? 'Hold (sec)' : 'Count'}
                    value={s.value} onChange={e => updateSet(i, 'value', Number(e.target.value))} />
                  {move.type === 'hold' && (
                    <input type="number" className="input" style={{ width: 60 }} placeholder="Reps"
                      value={s.reps} onChange={e => updateSet(i, 'reps', Number(e.target.value))} />
                  )}
                </div>
              ))}
              <div style={{ fontSize: 12, color: 'var(--neon-amber)', marginBottom: 8 }}>
                Volume: {calcTUT(sets.filter(s => s.value))}{move.type === 'hold' ? 's total' : ' reps'}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 10px' }} onClick={addSet}><Plus size={12} /> SET</button>
                <button className="btn btn-cyan" style={{ fontSize: 12, padding: '6px 12px' }} onClick={save}>LOG SESSION</button>
                {isCustom && (
                  <button className="btn btn-danger" style={{ fontSize: 12, padding: '6px 10px', marginLeft: 'auto' }} onClick={onDeleteMove}>
                    <Trash2 size={12} /> Delete Move
                  </button>
                )}
              </div>
            </div>

            {entries.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 6 }}>HISTORY</div>
                {[...entries].reverse().slice(0, 5).map((entry, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
                    borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11, width: 70, flexShrink: 0 }}>
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span style={{ flex: 1, color: 'var(--text-secondary)' }}>
                      {entry.sets.map(s => `${s.reps}×${s.value}${move.type === 'hold' ? 's' : ''}`).join(' · ')}
                    </span>
                    <span style={{ color: 'var(--neon-amber)', fontWeight: 700, fontSize: 12 }}>
                      {entry.tut}{move.type === 'hold' ? 's' : ''}
                    </span>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}
                      onClick={() => onDelete(entries.length - 1 - i)}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function AddMoveForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ name: '', type: 'hold', unit: 'seconds' })

  const handle = () => {
    if (!form.name.trim()) return
    onAdd({ id: `custom_${Date.now()}`, ...form, name: form.name.trim() })
  }

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      style={{ overflow: 'hidden', marginBottom: 12 }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, borderColor: 'var(--neon-cyan)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--neon-cyan)', letterSpacing: '0.08em' }}>NEW CUSTOM MOVE</div>

        <input className="input" placeholder="Move name (e.g. Dragon Tail)" value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />

        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>TYPE</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['hold', 'reps'].map(t => (
                <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))} style={{
                  flex: 1, padding: '7px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
                  background: form.type === t ? 'var(--neon-cyan-dim)' : 'rgba(255,255,255,0.5)',
                  color: form.type === t ? 'var(--neon-cyan)' : 'var(--text-muted)',
                  border: `1px solid ${form.type === t ? 'var(--neon-cyan)' : 'var(--border)'}`,
                }}>{t === 'hold' ? 'Hold' : 'Reps'}</button>
              ))}
            </div>
          </div>
        </div>

        <input className="input" placeholder={`Unit label (e.g. ${form.type === 'hold' ? 'seconds' : 'clean reps'})`}
          value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} />

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-cyan" onClick={handle}><Plus size={13} /> ADD MOVE</button>
          <button className="btn btn-ghost" onClick={onCancel}>CANCEL</button>
        </div>
      </div>
    </motion.div>
  )
}

export default function StrengthLog() {
  const [tab, setTab] = useState('power')
  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('strengthLogs') || '{}') } catch { return {} }
  })
  const [customMoves, setCustomMoves] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customStrengthMoves') || '{"power":[],"contortion":[]}') } catch { return { power: [], contortion: [] } }
  })
  const [showAddForm, setShowAddForm] = useState(false)

  const saveLogs = (data) => { setLogs(data); localStorage.setItem('strengthLogs', JSON.stringify(data)) }
  const saveCustomMoves = (data) => { setCustomMoves(data); localStorage.setItem('customStrengthMoves', JSON.stringify(data)) }

  const addEntry = (moveId, entry) => saveLogs({ ...logs, [moveId]: [...(logs[moveId] || []), entry] })
  const deleteEntry = (moveId, idx) => {
    const current = [...(logs[moveId] || [])]
    current.splice(idx, 1)
    saveLogs({ ...logs, [moveId]: current })
  }
  const addCustomMove = (move) => {
    const next = { ...customMoves, [tab]: [...(customMoves[tab] || []), move] }
    saveCustomMoves(next)
    setShowAddForm(false)
  }
  const deleteCustomMove = (moveId) => {
    const next = { ...customMoves, [tab]: customMoves[tab].filter(m => m.id !== moveId) }
    saveCustomMoves(next)
  }

  const presetMoves = tab === 'power' ? POWER_MOVES : CONTORTION_MOVES
  const allMoves = [...presetMoves, ...(customMoves[tab] || [])]

  const totalSessions = Object.values(logs).reduce((a, v) => a + v.length, 0)
  const bestTUT = Object.entries(logs).reduce((best, [id, entries]) => {
    const move = [...POWER_MOVES, ...CONTORTION_MOVES, ...(customMoves.power || []), ...(customMoves.contortion || [])].find(m => m.id === id)
    const maxTUT = entries.reduce((m, e) => Math.max(m, e.tut || 0), 0)
    if (maxTUT > best.value) return { name: move?.name || id, value: maxTUT }
    return best
  }, { name: '—', value: 0 })

  return (
    <div style={{ padding: '0 0 80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        <div className="card" style={{ textAlign: 'center', padding: '10px 8px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--neon-amber)' }}>{totalSessions}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>SESSIONS LOGGED</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '10px 8px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--neon-cyan)' }}>{bestTUT.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>BEST TUT: {bestTUT.value}s</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16, borderColor: 'var(--neon-amber)', background: 'var(--neon-amber-dim)', padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={16} style={{ color: 'var(--neon-amber)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11, color: 'var(--neon-amber)', fontWeight: 700, letterSpacing: '0.08em' }}>TIME UNDER TENSION</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>
              Volume = Reps × Hold Time &nbsp;|&nbsp; Target: beat your last session's total
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, background: 'rgba(255,255,255,0.6)', padding: 4, borderRadius: 14, border: '1px solid var(--border)' }}>
        {[
          { id: 'power', label: 'Power Moves', icon: <Dumbbell size={13} /> },
          { id: 'contortion', label: 'Contortion', icon: <Flame size={13} /> },
        ].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setShowAddForm(false) }} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, letterSpacing: '0.05em',
            background: tab === t.id ? 'rgba(255,255,255,0.9)' : 'transparent',
            color: tab === t.id ? 'var(--neon-amber)' : 'var(--text-secondary)',
            boxShadow: tab === t.id ? '0 2px 8px rgba(249,112,102,0.1)' : 'none',
            transition: 'all 0.2s',
          }}>{t.icon} {t.label.toUpperCase()}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {allMoves.map(move => (
            <SetLogger key={move.id} move={move}
              entries={logs[move.id] || []}
              onAdd={(entry) => addEntry(move.id, entry)}
              onDelete={(idx) => deleteEntry(move.id, idx)}
              isCustom={move.id.startsWith('custom_')}
              onDeleteMove={() => deleteCustomMove(move.id)} />
          ))}

          {/* Add custom move */}
          <AnimatePresence>
            {showAddForm && <AddMoveForm onAdd={addCustomMove} onCancel={() => setShowAddForm(false)} />}
          </AnimatePresence>

          {!showAddForm && (
            <button onClick={() => setShowAddForm(true)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '12px', borderRadius: 14, cursor: 'pointer', marginTop: 4,
              background: 'none', border: '1.5px dashed rgba(224,71,158,0.3)',
              color: 'var(--neon-cyan)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
            }}>
              <Plus size={14} /> Add Custom Move
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
