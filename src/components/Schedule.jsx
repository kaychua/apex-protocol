import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, BookOpen, X, Zap } from 'lucide-react'

const FOCUS_TYPES = [
  { id: 'pole',     label: 'Pole',        color: 'var(--neon-cyan)' },
  { id: 'strength', label: 'Strength',    color: 'var(--neon-amber)' },
  { id: 'flex',     label: 'Flexibility', color: 'var(--neon-purple)' },
  { id: 'flow',     label: 'Freestyle',   color: 'var(--neon-green)' },
  { id: 'rest',     label: 'Rest',        color: 'var(--text-muted)' },
]

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - ((day + 6) % 7))
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeekDates(monday) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function getFirstDay(year, month) { return new Date(year, month, 1).getDay() }

export default function Schedule() {
  const [calendar, setCalendar] = useState(() => {
    try { return JSON.parse(localStorage.getItem('staminaCalendar') || '{}') } catch { return {} }
  })
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedDay, setSelectedDay] = useState(() => toKey(new Date()))
  const [viewMonth, setViewMonth] = useState(() => {
    const n = new Date(); return { year: n.getFullYear(), month: n.getMonth() }
  })

  const saveCalendar = (data) => { setCalendar(data); localStorage.setItem('staminaCalendar', JSON.stringify(data)) }

  const updateDay = (key, changes) => {
    const existing = calendar[key] || {}
    const updated = { ...existing, ...changes }
    if (!updated.done && !updated.note && !updated.focus) {
      const { [key]: _, ...rest } = calendar
      saveCalendar(rest)
    } else {
      saveCalendar({ ...calendar, [key]: updated })
    }
  }

  const todayKey = toKey(new Date())

  // Week view
  const baseMonday = getMonday(new Date())
  baseMonday.setDate(baseMonday.getDate() + weekOffset * 7)
  const weekDates = getWeekDates(baseMonday)
  const weekStart = weekDates[0]
  const weekEnd = weekDates[6]
  const weekLabel = weekStart.getMonth() === weekEnd.getMonth()
    ? `${weekStart.toLocaleString('default', { month: 'short' })} ${weekStart.getDate()}–${weekEnd.getDate()}`
    : `${weekStart.toLocaleString('default', { month: 'short' })} ${weekStart.getDate()} – ${weekEnd.toLocaleString('default', { month: 'short' })} ${weekEnd.getDate()}`

  const weekDoneCount = weekDates.filter(d => calendar[toKey(d)]?.done).length

  // Month calendar
  const daysInMonth = getDaysInMonth(viewMonth.year, viewMonth.month)
  const firstDay = getFirstDay(viewMonth.year, viewMonth.month)
  const monthKey = `${viewMonth.year}-${String(viewMonth.month + 1).padStart(2, '0')}`
  const doneThisMonth = Object.keys(calendar).filter(k => k.startsWith(monthKey) && calendar[k]?.done).length
  const monthName = new Date(viewMonth.year, viewMonth.month).toLocaleString('default', { month: 'long', year: 'numeric' })

  const selectedDayData = selectedDay ? (calendar[selectedDay] || {}) : null
  const focusForSelected = selectedDayData?.focus || ''
  const focusMeta = FOCUS_TYPES.find(f => f.id === focusForSelected)

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Week navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={() => setWeekOffset(o => o - 1)}
          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 10,
            width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{weekLabel}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{weekDoneCount}/7 days trained</div>
        </div>
        {weekOffset < 0
          ? <button onClick={() => setWeekOffset(o => o + 1)}
              style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 10,
                width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <ChevronRight size={16} />
            </button>
          : <div style={{ width: 34 }} />
        }
      </div>

      {/* Week day tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, marginBottom: 12 }}>
        {weekDates.map((date, i) => {
          const key = toKey(date)
          const data = calendar[key] || {}
          const isToday = key === todayKey
          const isSelected = selectedDay === key
          const focus = FOCUS_TYPES.find(f => f.id === data.focus)
          const isPast = key < todayKey
          return (
            <motion.button key={key} whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedDay(isSelected ? null : key)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '8px 4px', borderRadius: 12, cursor: 'pointer',
                background: data.done ? (focus?.color ? `${focus.color}20` : 'rgba(45,212,160,0.12)')
                  : isSelected ? 'rgba(224,71,158,0.08)' : isToday ? 'rgba(224,71,158,0.06)' : 'rgba(255,255,255,0.6)',
                border: isSelected ? '2px solid var(--neon-cyan)'
                  : isToday ? '2px solid var(--neon-magenta)'
                  : data.done ? `1.5px solid ${focus?.color || 'var(--neon-green)'}40` : '1px solid var(--border)',
                transition: 'all 0.15s',
              }}>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.06em',
                color: isToday ? 'var(--neon-magenta)' : 'var(--text-muted)' }}>
                {DAY_LABELS[i].toUpperCase()}
              </span>
              <span style={{ fontSize: 14, fontWeight: 800,
                color: isSelected ? 'var(--neon-cyan)' : isToday ? 'var(--neon-magenta)' : data.done ? 'var(--text-primary)' : isPast ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
                {date.getDate()}
              </span>
              {data.done
                ? <div style={{ width: 5, height: 5, borderRadius: '50%', background: focus?.color || 'var(--neon-green)' }} />
                : data.focus
                ? <div style={{ width: 5, height: 5, borderRadius: '50%', background: focus?.color || 'var(--border)', opacity: 0.5 }} />
                : <div style={{ width: 5, height: 5 }} />
              }
            </motion.button>
          )
        })}
      </div>

      {/* Day detail panel */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div key={selectedDay} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="card" style={{ marginBottom: 16, borderColor: focusMeta?.color || 'var(--neon-cyan)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={14} style={{ color: focusMeta?.color || 'var(--neon-cyan)' }} />
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                  {new Date(selectedDay + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <button onClick={() => setSelectedDay(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                <X size={16} />
              </button>
            </div>

            {/* Focus type selector */}
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 7, fontWeight: 600 }}>TRAINING FOCUS</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
              {FOCUS_TYPES.map(f => (
                <button key={f.id} onClick={() => updateDay(selectedDay, { focus: focusForSelected === f.id ? '' : f.id })}
                  style={{
                    padding: '5px 11px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11,
                    background: focusForSelected === f.id ? f.color + '22' : 'rgba(255,255,255,0.6)',
                    color: focusForSelected === f.id ? f.color : 'var(--text-muted)',
                    outline: focusForSelected === f.id ? `1.5px solid ${f.color}` : '1px solid var(--border)',
                    transition: 'all 0.15s',
                  }}>{f.label}</button>
              ))}
            </div>

            {/* Notes */}
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 6, fontWeight: 600 }}>PLAN / NOTES</div>
            <textarea className="input"
              placeholder="What are you training? e.g. Iron X holds, needle stretch, left-side Jade..."
              value={calendar[selectedDay]?.note || ''}
              onChange={e => updateDay(selectedDay, { note: e.target.value })}
              style={{ minHeight: 80, fontSize: 13, lineHeight: 1.5, marginBottom: 10 }} />

            {/* Done toggle */}
            <button onClick={() => updateDay(selectedDay, { done: !calendar[selectedDay]?.done })} style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              background: calendar[selectedDay]?.done ? 'rgba(45,212,160,0.1)' : 'rgba(255,255,255,0.5)',
              border: `1.5px solid ${calendar[selectedDay]?.done ? 'var(--neon-green)' : 'var(--border)'}`,
              borderRadius: 10, padding: '9px 14px', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
              color: calendar[selectedDay]?.done ? 'var(--neon-green)' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}>
              {calendar[selectedDay]?.done
                ? <CheckCircle2 size={16} style={{ color: 'var(--neon-green)' }} />
                : <Circle size={16} style={{ color: 'var(--text-muted)' }} />}
              {calendar[selectedDay]?.done ? 'Session done' : 'Mark as done'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 14px' }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.12em', fontWeight: 700 }}>MONTHLY VIEW</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* Month stats */}
      <div className="card" style={{ marginBottom: 10, padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--neon-purple)', fontWeight: 700, letterSpacing: '0.1em' }}>TRAINING DAYS</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{doneThisMonth} sessions logged this month</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--neon-purple)', lineHeight: 1 }}>{doneThisMonth}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>/ {daysInMonth}</div>
          </div>
        </div>
        <div style={{ height: 4, background: 'var(--bg-deep)', borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
          <div style={{ width: `${(doneThisMonth / daysInMonth) * 100}%`, height: '100%', background: 'var(--neon-purple)', borderRadius: 2, transition: 'width 0.4s' }} />
        </div>
      </div>

      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <button className="btn btn-ghost" style={{ padding: '6px 10px' }}
          onClick={() => setViewMonth(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 })}>
          <ChevronLeft size={14} />
        </button>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.08em', color: 'var(--text-primary)' }}>
          {monthName.toUpperCase()}
        </span>
        <button className="btn btn-ghost" style={{ padding: '6px 10px' }}
          onClick={() => setViewMonth(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 })}>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 12 }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', padding: '3px 0', fontWeight: 700 }}>{d}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const key = `${monthKey}-${String(day).padStart(2, '0')}`
          const data = calendar[key] || {}
          const focus = FOCUS_TYPES.find(f => f.id === data.focus)
          const isToday = key === todayKey
          const isSelected = selectedDay === key
          return (
            <motion.button key={key} whileTap={{ scale: 0.88 }}
              onClick={() => setSelectedDay(isSelected ? null : key)}
              style={{
                aspectRatio: '1', borderRadius: 10, cursor: 'pointer',
                background: data.done ? (focus?.color ? `${focus.color}25` : 'rgba(45,212,160,0.15)') : isSelected ? 'rgba(224,71,158,0.08)' : isToday ? 'rgba(224,71,158,0.06)' : 'rgba(255,255,255,0.6)',
                border: isSelected ? '2px solid var(--neon-cyan)' : isToday ? '2px solid var(--neon-magenta)' : data.done ? `1.5px solid ${focus?.color || 'var(--neon-green)'}60` : '1px solid var(--border)',
                color: data.done ? (focus?.color || 'var(--neon-green)') : isToday ? 'var(--neon-magenta)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                transition: 'all 0.15s',
              }}>
              {day}
              {(data.note || data.focus) && !data.done && (
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: focus?.color || 'var(--text-muted)', opacity: 0.6 }} />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Month target card */}
      <div className="card" style={{ borderColor: 'rgba(224,71,158,0.3)', background: 'rgba(224,71,158,0.04)', padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Zap size={14} style={{ color: 'var(--neon-magenta)', flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'var(--neon-magenta)', fontWeight: 700, letterSpacing: '0.08em' }}>MONTHLY TARGET</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
          Aim for <strong style={{ color: 'var(--text-primary)' }}>20+ training days</strong> to build real consistency. Mix pole, strength, and flexibility sessions.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 4, background: 'var(--bg-deep)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min((doneThisMonth / 20) * 100, 100)}%`, height: '100%',
              background: 'var(--neon-magenta)', borderRadius: 2, transition: 'width 0.4s' }} />
          </div>
          <span style={{ fontSize: 12, color: 'var(--neon-magenta)', fontWeight: 700 }}>{doneThisMonth}/20</span>
        </div>
      </div>
    </div>
  )
}
