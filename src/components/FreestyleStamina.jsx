import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, Plus, Trash2, Repeat } from 'lucide-react'

const FREESTYLE_PROMPTS = [
  { id: 1, category: 'Focus', prompt: 'Transitions only — every move must flow into the next with no dead stops.' },
  { id: 2, category: 'Focus', prompt: 'Floorwork only — stay low, use the ground as your stage.' },
  { id: 3, category: 'Focus', prompt: 'Bad side dominant — lead every combo with your weaker side.' },
  { id: 4, category: 'Emotion', prompt: 'Perform with zero emotion — pure athletic precision. No performance face.' },
  { id: 5, category: 'Emotion', prompt: 'Full character — pick a song and embody it completely. Commit to every second.' },
  { id: 6, category: 'Emotion', prompt: "Dance as if you're in the final 30 seconds of your competition routine." },
  { id: 7, category: 'Technical', prompt: 'Slow everything down — every trick at half speed to feel every engagement.' },
  { id: 8, category: 'Technical', prompt: 'No hands — explore balance, spins, and drops using only legs and core.' },
  { id: 9, category: 'Technical', prompt: 'String 5 tricks together before any floorwork. Stay on the pole.' },
  { id: 10, category: 'Technical', prompt: 'Entry and exit polish — every trick must have a deliberate start and finish.' },
  { id: 11, category: 'Stamina', prompt: '3 full run-throughs back-to-back. No rest between. Test your cardio.' },
  { id: 12, category: 'Stamina', prompt: 'One song. Full out. Film it. Watch it back.' },
  { id: 13, category: 'Stamina', prompt: 'Repeat your hardest trick 10 times with no break.' },
  { id: 14, category: 'Creativity', prompt: "Invent one new transition you've never done before. Name it." },
  { id: 15, category: 'Creativity', prompt: 'Use a song outside your comfort zone. Let it guide your movement.' },
  { id: 16, category: 'Creativity', prompt: 'Pick a theme: water, fire, storm. Move as that element for one song.' },
  { id: 17, category: 'Contortion', prompt: 'Every shape must involve a back-bend or split. Foreground your flexibility.' },
  { id: 18, category: 'Contortion', prompt: 'Needle focus — every combo ends in a needle point variation.' },
]

const CATEGORY_COLORS = {
  Focus:      'var(--neon-cyan)',
  Emotion:    'var(--neon-magenta)',
  Technical:  'var(--neon-amber)',
  Stamina:    'var(--neon-magenta)',
  Creativity: 'var(--neon-purple)',
  Contortion: 'var(--neon-green)',
}

export default function FreestyleStamina() {
  const [currentPrompt, setCurrentPrompt] = useState(null)
  const [filterCat, setFilterCat] = useState('All')
  const [spinning, setSpinning] = useState(false)
  const [customPrompts, setCustomPrompts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customPrompts') || '[]') } catch { return [] }
  })
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [newCustom, setNewCustom] = useState({ category: 'Focus', prompt: '' })

  const saveCustom = (data) => { setCustomPrompts(data); localStorage.setItem('customPrompts', JSON.stringify(data)) }

  const allPrompts = [...FREESTYLE_PROMPTS, ...customPrompts]
  const filteredPrompts = filterCat === 'All' ? allPrompts : allPrompts.filter(p => p.category === filterCat)
  const categories = ['All', ...Object.keys(CATEGORY_COLORS)]

  const spin = useCallback(() => {
    if (spinning) return
    setSpinning(true)
    let count = 0
    const pool = filteredPrompts
    const interval = setInterval(() => {
      setCurrentPrompt(pool[Math.floor(Math.random() * pool.length)])
      count++
      if (count > 12) {
        clearInterval(interval)
        setCurrentPrompt(pool[Math.floor(Math.random() * pool.length)])
        setSpinning(false)
      }
    }, 80)
  }, [spinning, filteredPrompts])

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Category filter */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)} style={{
            padding: '5px 11px', borderRadius: 20, cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.05em',
            background: filterCat === cat
              ? cat === 'All' ? 'var(--neon-purple-dim)' : `${CATEGORY_COLORS[cat]}20`
              : 'rgba(255,255,255,0.6)',
            color: filterCat === cat
              ? cat === 'All' ? 'var(--neon-purple)' : CATEGORY_COLORS[cat]
              : 'var(--text-muted)',
            border: filterCat === cat
              ? `1.5px solid ${cat === 'All' ? 'var(--neon-purple)' : CATEGORY_COLORS[cat]}`
              : '1px solid var(--border)',
            transition: 'all 0.15s',
          }}>{cat.toUpperCase()}</button>
        ))}
      </div>

      {/* Spin button */}
      <motion.button className="btn btn-purple"
        style={{ width: '100%', justifyContent: 'center', marginBottom: 16, padding: '14px', fontSize: 15 }}
        onClick={spin} whileTap={{ scale: 0.97 }}
        animate={spinning ? { boxShadow: ['0 0 0px rgba(155,111,232,0)', '0 0 20px rgba(155,111,232,0.5)', '0 0 0px rgba(155,111,232,0)'] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}>
        <Shuffle size={18} />
        {spinning ? 'GENERATING...' : 'GENERATE FREESTYLE PROMPT'}
      </motion.button>

      {/* Current prompt */}
      <AnimatePresence mode="wait">
        {currentPrompt && (
          <motion.div key={currentPrompt.id} initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="card" style={{
              marginBottom: 16, padding: '20px',
              borderColor: CATEGORY_COLORS[currentPrompt.category] || 'var(--neon-purple)',
              background: `${CATEGORY_COLORS[currentPrompt.category] || 'var(--neon-purple)'}08`,
              textAlign: 'center',
            }}>
            <span style={{
              display: 'inline-block', marginBottom: 10, fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
              color: CATEGORY_COLORS[currentPrompt.category],
              border: `1px solid ${CATEGORY_COLORS[currentPrompt.category]}`,
              padding: '2px 10px', borderRadius: 10,
            }}>{currentPrompt.category.toUpperCase()}</span>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
              {currentPrompt.prompt}
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8 }}>
              <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={spin}>
                <Repeat size={12} /> NEW PROMPT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom prompt form */}
      <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}
        onClick={() => setShowCustomForm(s => !s)}>
        <Plus size={13} /> CREATE CUSTOM PROMPT
      </button>
      <AnimatePresence>
        {showCustomForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 8 }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, borderColor: 'var(--neon-purple)' }}>
              <select className="input" value={newCustom.category}
                onChange={e => setNewCustom(p => ({ ...p, category: e.target.value }))}>
                {Object.keys(CATEGORY_COLORS).map(c => <option key={c}>{c}</option>)}
              </select>
              <textarea className="input" placeholder="Your custom freestyle prompt..." value={newCustom.prompt}
                onChange={e => setNewCustom(p => ({ ...p, prompt: e.target.value }))} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-purple" onClick={() => {
                  if (!newCustom.prompt.trim()) return
                  saveCustom([...customPrompts, { ...newCustom, id: `custom_${Date.now()}` }])
                  setNewCustom({ category: 'Focus', prompt: '' }); setShowCustomForm(false)
                }}><Plus size={13} /> Save</button>
                <button className="btn btn-ghost" onClick={() => setShowCustomForm(false)}>Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All prompts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
        {filteredPrompts.map(p => (
          <motion.div key={p.id} layout
            className="card" style={{ padding: '10px 12px', cursor: 'pointer', borderLeft: `3px solid ${CATEGORY_COLORS[p.category]}` }}
            onClick={() => setCurrentPrompt(p)} whileTap={{ scale: 0.99 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', padding: '2px 6px',
                borderRadius: 8, background: `${CATEGORY_COLORS[p.category]}20`,
                color: CATEGORY_COLORS[p.category], flexShrink: 0, marginTop: 1,
              }}>{p.category.toUpperCase()}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{p.prompt}</span>
              {p.id?.toString().startsWith('custom') && (
                <button onClick={e => { e.stopPropagation(); saveCustom(customPrompts.filter(cp => cp.id !== p.id)) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0 }}>
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
