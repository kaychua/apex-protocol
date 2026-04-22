import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, Calendar, Plus, Trash2, CheckSquare, Square, Zap, Clock, Music, Repeat, BookOpen, CheckCircle2, Circle, X } from 'lucide-react'

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
  { id: 13, category: 'Stamina', prompt: 'Repeat your nemesis trick 10 times with no break.' },
  { id: 14, category: 'Creativity', prompt: "Invent one new transition you've never done before. Name it." },
  { id: 15, category: 'Creativity', prompt: 'Use a song outside your comfort zone. Let it guide your movement.' },
  { id: 16, category: 'Creativity', prompt: 'Pick a theme: water, fire, storm. Move as that element for one song.' },
  { id: 17, category: 'Contortion', prompt: 'Every shape must involve a back-bend or split. Foreground your flexibility.' },
  { id: 18, category: 'Contortion', prompt: 'Needle focus — every combo ends in a needle point variation.' },
]

const CATEGORY_COLORS = {
  Focus: 'var(--neon-cyan)',
  Emotion: 'var(--neon-magenta)',
  Technical: 'var(--neon-amber)',
  Stamina: 'var(--neon-magenta)',
  Creativity: 'var(--neon-purple)',
  Contortion: 'var(--neon-green)',
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function FreestyleStamina() {
  const [tab, setTab] = useState('freestyle')
  const [currentPrompt, setCurrentPrompt] = useState(null)
  const [filterCat, setFilterCat] = useState('All')
  const [spinning, setSpinning] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)

  const [calendar, setCalendar] = useState(() => {
    try { return JSON.parse(localStorage.getItem('staminaCalendar') || '{}') } catch { return {} }
  })
  const [viewMonth, setViewMonth] = useState(() => {
    const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() }
  })
  const [customPrompts, setCustomPrompts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customPrompts') || '[]') } catch { return [] }
  })
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [newCustom, setNewCustom] = useState({ category: 'Focus', prompt: '' })

  const saveCalendar = (data) => { setCalendar(data); localStorage.setItem('staminaCalendar', JSON.stringify(data)) }
  const saveCustom = (data) => { setCustomPrompts(data); localStorage.setItem('customPrompts', JSON.stringify(data)) }

  const toggleDayDone = (key) => {
    const day = calendar[key] || {}
    const next = { ...calendar, [key]: { ...day, done: !day.done } }
    if (!next[key].done && !next[key].note) { const { [key]: _, ...rest } = next; saveCalendar(rest) }
    else saveCalendar(next)
  }
  const updateDayNote = (key, note) => {
    const day = calendar[key] || {}
    if (!note && !day.done) { const { [key]: _, ...rest } = calendar; saveCalendar(rest) }
    else saveCalendar({ ...calendar, [key]: { ...day, note } })
  }

  const allPrompts = [...FREESTYLE_PROMPTS, ...customPrompts]
  const filteredPrompts = filterCat === 'All' ? allPrompts : allPrompts.filter(p => p.category === filterCat)

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

  const todayKey = new Date().toISOString().slice(0, 10)

  const daysInMonth = getDaysInMonth(viewMonth.year, viewMonth.month)
  const firstDay = getFirstDayOfMonth(viewMonth.year, viewMonth.month)
  const doneThisMonth = Object.keys(calendar).filter(k => k.startsWith(`${viewMonth.year}-${String(viewMonth.month + 1).padStart(2, '0')}`)).length

  const monthName = new Date(viewMonth.year, viewMonth.month).toLocaleString('default', { month: 'long', year: 'numeric' })

  const prevMonth = () => setViewMonth(v => {
    if (v.month === 0) return { year: v.year - 1, month: 11 }
    return { ...v, month: v.month - 1 }
  })
  const nextMonth = () => setViewMonth(v => {
    if (v.month === 11) return { year: v.year + 1, month: 0 }
    return { ...v, month: v.month + 1 }
  })

  const categories = ['All', ...Object.keys(CATEGORY_COLORS)]

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--bg-card)', padding: 4, borderRadius: 8, border: '1px solid var(--border)' }}>
        {[
          { id: 'freestyle', label: 'Generator', icon: <Shuffle size={13} /> },
          { id: 'stamina', label: 'Calendar', icon: <Calendar size={13} /> },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '7px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, letterSpacing: '0.06em',
            background: tab === t.id ? 'var(--neon-purple-dim)' : 'transparent',
            color: tab === t.id ? 'var(--neon-purple)' : 'var(--text-secondary)',
            transition: 'all 0.2s',
          }}>{t.icon} {t.label.toUpperCase()}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'freestyle' ? (
          <motion.div key="freestyle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Category filter */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilterCat(cat)} style={{
                  padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em',
                  background: filterCat === cat
                    ? cat === 'All' ? 'var(--neon-purple-dim)' : `${CATEGORY_COLORS[cat]}20`
                    : 'var(--bg-card)',
                  color: filterCat === cat
                    ? cat === 'All' ? 'var(--neon-purple)' : CATEGORY_COLORS[cat]
                    : 'var(--text-muted)',
                  border: filterCat === cat
                    ? `1px solid ${cat === 'All' ? 'var(--neon-purple)' : CATEGORY_COLORS[cat]}`
                    : '1px solid var(--border)',
                  transition: 'all 0.15s',
                }}>{cat.toUpperCase()}</button>
              ))}
            </div>

            {/* Spin button */}
            <motion.button
              className="btn btn-purple"
              style={{ width: '100%', justifyContent: 'center', marginBottom: 16, padding: '14px', fontSize: 15 }}
              onClick={spin}
              whileTap={{ scale: 0.97 }}
              animate={spinning ? { boxShadow: ['0 0 0px rgba(157,78,221,0)', '0 0 20px rgba(157,78,221,0.6)', '0 0 0px rgba(157,78,221,0)'] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <Shuffle size={18} />
              {spinning ? 'GENERATING...' : 'GENERATE FREESTYLE PROMPT'}
            </motion.button>

            {/* Current prompt */}
            <AnimatePresence mode="wait">
              {currentPrompt && (
                <motion.div key={currentPrompt.id} initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="card cyber-corner" style={{
                    marginBottom: 16, padding: '20px',
                    borderColor: CATEGORY_COLORS[currentPrompt.category] || 'var(--neon-purple)',
                    background: `${CATEGORY_COLORS[currentPrompt.category] || 'var(--neon-purple)'}08`,
                    textAlign: 'center',
                  }}>
                  <span style={{
                    display: 'inline-block', marginBottom: 10,
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.15em',
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

            {/* All prompts list */}
            <div style={{ marginBottom: 12 }}>
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
                          setNewCustom({ category: 'Focus', prompt: '' })
                          setShowCustomForm(false)
                        }}><Plus size={13} /> SAVE</button>
                        <button className="btn btn-ghost" onClick={() => setShowCustomForm(false)}>CANCEL</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Prompt grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filteredPrompts.map(p => (
                <motion.div key={p.id} layout
                  className="card" style={{ padding: '10px 12px', cursor: 'pointer', borderLeft: `3px solid ${CATEGORY_COLORS[p.category]}` }}
                  onClick={() => setCurrentPrompt(p)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
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
          </motion.div>
        ) : (
          <motion.div key="calendar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Month stats */}
            <div className="card" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--neon-purple)', letterSpacing: '0.1em' }}>
                  STAMINA CALENDAR
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {doneThisMonth} training days this month
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--neon-purple)' }}>{doneThisMonth}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>/ {daysInMonth} days</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="progress-bar" style={{ marginBottom: 16 }}>
              <div className="progress-fill" style={{ width: `${(doneThisMonth / daysInMonth) * 100}%`, background: 'var(--neon-purple)' }} />
            </div>

            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={prevMonth}>◀</button>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
                {monthName.toUpperCase()}
              </span>
              <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={nextMonth}>▶</button>
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 12 }}>
              {['S','M','T','W','T','F','S'].map((d, i) => (
                <div key={i} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', padding: '4px 0', fontWeight: 700 }}>{d}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const key = `${viewMonth.year}-${String(viewMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const done = calendar[key]?.done
                const hasNote = !!calendar[key]?.note
                const isToday = key === todayKey
                const isSelected = selectedDay === key
                return (
                  <motion.button key={key} whileTap={{ scale: 0.88 }}
                    onClick={() => setSelectedDay(isSelected ? null : key)}
                    style={{
                      aspectRatio: '1', borderRadius: 10, cursor: 'pointer',
                      border: isSelected ? '2px solid var(--neon-cyan)' : isToday ? '2px solid var(--neon-purple)' : '1px solid var(--border)',
                      background: done ? 'var(--neon-purple)' : isSelected ? 'rgba(224,71,158,0.08)' : isToday ? 'var(--neon-purple-dim)' : 'rgba(255,255,255,0.6)',
                      color: done ? '#fff' : isSelected ? 'var(--neon-cyan)' : isToday ? 'var(--neon-purple)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                      transition: 'all 0.15s',
                      boxShadow: done ? '0 2px 10px rgba(155,111,232,0.25)' : isSelected ? '0 2px 10px rgba(224,71,158,0.15)' : 'none',
                      position: 'relative',
                    }}>
                    {day}
                    {hasNote && (
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: done ? 'rgba(255,255,255,0.8)' : 'var(--neon-cyan)', flexShrink: 0 }} />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Day detail panel */}
            <AnimatePresence>
              {selectedDay && (
                <motion.div key={selectedDay} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="card" style={{ marginBottom: 16, borderColor: 'var(--neon-cyan)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <BookOpen size={15} style={{ color: 'var(--neon-cyan)' }} />
                      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                        {new Date(selectedDay + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <button onClick={() => setSelectedDay(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                      <X size={16} />
                    </button>
                  </div>

                  {/* Done toggle */}
                  <button onClick={() => toggleDayDone(selectedDay)} style={{
                    display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                    background: calendar[selectedDay]?.done ? 'rgba(155,111,232,0.1)' : 'rgba(255,255,255,0.5)',
                    border: `1.5px solid ${calendar[selectedDay]?.done ? 'var(--neon-purple)' : 'var(--border)'}`,
                    borderRadius: 10, padding: '8px 12px', cursor: 'pointer', marginBottom: 10,
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
                    color: calendar[selectedDay]?.done ? 'var(--neon-purple)' : 'var(--text-secondary)',
                    transition: 'all 0.15s',
                  }}>
                    {calendar[selectedDay]?.done
                      ? <CheckCircle2 size={16} style={{ color: 'var(--neon-purple)' }} />
                      : <Circle size={16} style={{ color: 'var(--text-muted)' }} />}
                    {calendar[selectedDay]?.done ? 'Trained ✓' : 'Mark as trained'}
                  </button>

                  {/* Note field */}
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 5, letterSpacing: '0.08em', fontWeight: 600 }}>
                    TRAINING PLAN FOR THIS DAY
                  </div>
                  <textarea className="input"
                    placeholder="What are you working on? e.g. Iron X holds × 3 sets, Needle stretches, Left-side Jade practice…"
                    value={calendar[selectedDay]?.note || ''}
                    onChange={e => updateDayNote(selectedDay, e.target.value)}
                    style={{ minHeight: 90, fontSize: 14, lineHeight: 1.5 }} />
                  {calendar[selectedDay]?.note && (
                    <div style={{ marginTop: 6, textAlign: 'right' }}>
                      <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}
                        onClick={() => updateDayNote(selectedDay, '')}>
                        Clear note
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Competition goal */}
            <div className="card" style={{ borderColor: 'var(--neon-magenta)', background: 'var(--neon-magenta-dim)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Zap size={16} style={{ color: 'var(--neon-magenta)' }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--neon-magenta)', letterSpacing: '0.1em' }}>
                  COMPETITION GOAL
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Train <strong style={{ color: 'var(--text-primary)' }}>20+ days</strong> this month to build competition-ready stamina.
                Full run-throughs in the last 7 days. Film every one.
              </div>
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{
                    width: `${Math.min((doneThisMonth / 20) * 100, 100)}%`,
                    background: 'var(--neon-magenta)'
                  }} />
                </div>
                <span style={{ fontSize: 12, color: 'var(--neon-magenta)', fontWeight: 700 }}>
                  {doneThisMonth}/20
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
