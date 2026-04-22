import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Pencil, Check, X, ChevronDown, ChevronRight, BookOpen, Settings2 } from 'lucide-react'

const TRICK_LIBRARY = [
  // Beginner Pole
  { id: 'lib_fireman', name: 'Fireman Spin', category: 'Pole Foundations', difficulty: 'beginner' },
  { id: 'lib_chair', name: 'Chair Spin', category: 'Pole Foundations', difficulty: 'beginner' },
  { id: 'lib_front_hook', name: 'Front Hook Spin', category: 'Pole Foundations', difficulty: 'beginner' },
  { id: 'lib_back_hook', name: 'Back Hook Spin', category: 'Pole Foundations', difficulty: 'beginner' },
  { id: 'lib_carousel', name: 'Carousel Spin', category: 'Pole Foundations', difficulty: 'beginner' },
  { id: 'lib_crucifix', name: 'Crucifix', category: 'Pole Foundations', difficulty: 'beginner' },
  { id: 'lib_pole_sit', name: 'Pole Sit', category: 'Pole Foundations', difficulty: 'beginner' },
  { id: 'lib_layout', name: 'Layout Spin', category: 'Pole Foundations', difficulty: 'beginner' },
  { id: 'lib_pencil', name: 'Pencil Spin', category: 'Pole Foundations', difficulty: 'beginner' },
  { id: 'lib_fan_kick', name: 'Fan Kick', category: 'Pole Foundations', difficulty: 'beginner' },
  // Intermediate Pole
  { id: 'lib_invert', name: 'Basic Invert', category: 'Pole Foundations', difficulty: 'intermediate' },
  { id: 'lib_brass', name: 'Brass Monkey', category: 'Pole Foundations', difficulty: 'intermediate' },
  { id: 'lib_crossknee', name: 'Cross-Knee Release', category: 'Pole Foundations', difficulty: 'intermediate' },
  { id: 'lib_gemini', name: 'Gemini', category: 'Pole Foundations', difficulty: 'intermediate' },
  { id: 'lib_scorpio', name: 'Scorpio', category: 'Pole Foundations', difficulty: 'intermediate' },
  { id: 'lib_allegra', name: 'Allegra', category: 'Pole Foundations', difficulty: 'intermediate' },
  { id: 'lib_jasmine', name: 'Jasmine', category: 'Pole Foundations', difficulty: 'intermediate' },
  { id: 'lib_iguana', name: 'Iguana', category: 'Pole Foundations', difficulty: 'intermediate' },
  { id: 'lib_jade', name: 'Jade Split', category: 'Pole Foundations', difficulty: 'intermediate' },
  { id: 'lib_butterfly', name: 'Butterfly', category: 'Pole Foundations', difficulty: 'intermediate' },
  // Advanced Pole
  { id: 'lib_ayesha', name: 'Ayesha', category: 'Pole Foundations', difficulty: 'advanced' },
  { id: 'lib_iron_x', name: 'Iron X', category: 'Pole Foundations', difficulty: 'advanced' },
  { id: 'lib_handspring', name: 'Handspring Mount', category: 'Pole Foundations', difficulty: 'advanced' },
  { id: 'lib_deadlift', name: 'Deadlift Ayesha', category: 'Pole Foundations', difficulty: 'advanced' },
  { id: 'lib_superman', name: 'Superman', category: 'Pole Foundations', difficulty: 'advanced' },
  { id: 'lib_flag', name: 'Human Flag', category: 'Pole Foundations', difficulty: 'advanced' },
  { id: 'lib_chopper', name: 'Chopper', category: 'Pole Foundations', difficulty: 'advanced' },
  { id: 'lib_saturn', name: 'Saturn', category: 'Pole Foundations', difficulty: 'advanced' },
  { id: 'lib_rainbow', name: 'Rainbow Marchenko', category: 'Pole Foundations', difficulty: 'advanced' },
  // Elite Pole
  { id: 'lib_iguana_ext', name: 'Iguana Extension', category: 'Elite Flex Tricks', difficulty: 'elite' },
  { id: 'lib_chopperx', name: 'Chopper X', category: 'Elite Flex Tricks', difficulty: 'elite' },
  { id: 'lib_meathook', name: 'Meat Hook', category: 'Elite Flex Tricks', difficulty: 'elite' },
  { id: 'lib_spatchcock', name: 'Spatchcock', category: 'Elite Flex Tricks', difficulty: 'elite' },
  { id: 'lib_dragonfly', name: 'Dragonfly', category: 'Elite Flex Tricks', difficulty: 'elite' },
  { id: 'lib_phoenix', name: 'Phoenix', category: 'Elite Flex Tricks', difficulty: 'elite' },
  { id: 'lib_fonji', name: 'Fonji', category: 'Elite Flex Tricks', difficulty: 'elite' },
  { id: 'lib_marченко', name: 'Marchenko', category: 'Elite Flex Tricks', difficulty: 'elite' },
  { id: 'lib_twisted_grip_hs', name: 'Twisted Grip Handspring', category: 'Elite Flex Tricks', difficulty: 'elite' },
  { id: 'lib_planche', name: 'Pole Planche', category: 'Elite Flex Tricks', difficulty: 'elite' },
  // Contortion
  { id: 'lib_bridge', name: 'Back Bridge', category: 'Contortion', difficulty: 'beginner' },
  { id: 'lib_split', name: 'Center Split', category: 'Contortion', difficulty: 'beginner' },
  { id: 'lib_split_l', name: 'Left Split', category: 'Contortion', difficulty: 'beginner' },
  { id: 'lib_split_r', name: 'Right Split', category: 'Contortion', difficulty: 'beginner' },
  { id: 'lib_wheel', name: 'Wheel Pose', category: 'Contortion', difficulty: 'intermediate' },
  { id: 'lib_back_walkover', name: 'Back Walkover', category: 'Contortion', difficulty: 'intermediate' },
  { id: 'lib_front_walkover', name: 'Front Walkover', category: 'Contortion', difficulty: 'intermediate' },
  { id: 'lib_scorpion', name: 'Scorpion Pose', category: 'Contortion', difficulty: 'intermediate' },
  { id: 'lib_needle', name: 'Needle', category: 'Contortion', difficulty: 'intermediate' },
  { id: 'lib_chest_stand', name: 'Chest Stand', category: 'Contortion', difficulty: 'intermediate' },
  { id: 'lib_oversplit', name: 'Oversplit', category: 'Contortion', difficulty: 'advanced' },
  { id: 'lib_spine_fold', name: 'Full Spine Fold', category: 'Contortion', difficulty: 'advanced' },
  { id: 'lib_head_to_feet', name: 'Head to Feet', category: 'Contortion', difficulty: 'advanced' },
  { id: 'lib_elbow_stand', name: 'Elbow Stand', category: 'Contortion', difficulty: 'advanced' },
  { id: 'lib_forearm_stand', name: 'Forearm Stand', category: 'Contortion', difficulty: 'advanced' },
  { id: 'lib_handstand', name: 'Handstand', category: 'Contortion', difficulty: 'advanced' },
  { id: 'lib_contortion_hs', name: 'Contortion Handstand', category: 'Contortion', difficulty: 'elite' },
  { id: 'lib_moonbow', name: 'Moonbow', category: 'Contortion', difficulty: 'elite' },
  { id: 'lib_king_pigeon', name: 'King Pigeon', category: 'Contortion', difficulty: 'elite' },
  { id: 'lib_triple_fold', name: 'Triple Fold', category: 'Contortion', difficulty: 'elite' },
  // Floorwork
  { id: 'lib_hip_roll', name: 'Hip Roll', category: 'Floorwork', difficulty: 'beginner' },
  { id: 'lib_body_wave', name: 'Body Wave', category: 'Floorwork', difficulty: 'beginner' },
  { id: 'lib_cat_stretch', name: 'Cat Stretch', category: 'Floorwork', difficulty: 'beginner' },
  { id: 'lib_floor_spin', name: 'Floor Spin', category: 'Floorwork', difficulty: 'intermediate' },
  { id: 'lib_fan_floorwork', name: 'Fan Kick Floorwork', category: 'Floorwork', difficulty: 'intermediate' },
  { id: 'lib_knee_spin', name: 'Knee Spin', category: 'Floorwork', difficulty: 'intermediate' },
  { id: 'lib_windmill', name: 'Windmill', category: 'Floorwork', difficulty: 'advanced' },
  { id: 'lib_attitude', name: 'Attitude Turn', category: 'Floorwork', difficulty: 'advanced' },
  // Transitions
  { id: 'lib_pole_drop', name: 'Pole Drop', category: 'Transitions', difficulty: 'intermediate' },
  { id: 'lib_layback', name: 'Layback', category: 'Transitions', difficulty: 'intermediate' },
  { id: 'lib_layback_spin', name: 'Layback Spin', category: 'Transitions', difficulty: 'advanced' },
  { id: 'lib_hip_hold', name: 'Hip Hold Transition', category: 'Transitions', difficulty: 'intermediate' },
  { id: 'lib_dive', name: 'Diving Transition', category: 'Transitions', difficulty: 'advanced' },
  { id: 'lib_carousel_to_invert', name: 'Carousel to Invert', category: 'Transitions', difficulty: 'advanced' },
]

const DIFFICULTY_COLORS = {
  beginner:     { color: '#2dd4a0', bg: 'rgba(45,212,160,0.12)' },
  intermediate: { color: '#e0479e', bg: 'rgba(224,71,158,0.12)' },
  advanced:     { color: '#9b6fe8', bg: 'rgba(155,111,232,0.12)' },
  elite:        { color: '#f43f6a', bg: 'rgba(244,63,106,0.12)' },
}

function loadCategories() {
  try {
    const saved = localStorage.getItem('skillCategories')
    if (saved) return JSON.parse(saved)
  } catch {}
  return null
}

function saveCategories(cats) {
  localStorage.setItem('skillCategories', JSON.stringify(cats))
}

// --- Skill Tree Manager ---
function SkillTreeManager() {
  const [categories, setCategories] = useState(() => loadCategories() || [])
  const [expanded, setExpanded] = useState({})
  const [editingCat, setEditingCat] = useState(null)
  const [editCatName, setEditCatName] = useState('')
  const [addingTrick, setAddingTrick] = useState(null)
  const [newTrickName, setNewTrickName] = useState('')
  const [newTrickLevel, setNewTrickLevel] = useState('beginner')
  const [editingTrick, setEditingTrick] = useState(null)
  const [editTrickName, setEditTrickName] = useState('')
  const [editTrickLevel, setEditTrickLevel] = useState('beginner')
  const [newCatName, setNewCatName] = useState('')
  const [showAddCat, setShowAddCat] = useState(false)

  const update = (cats) => { setCategories(cats); saveCategories(cats) }

  const renameCategory = (idx, name) => {
    const next = categories.map((c, i) => i === idx ? { ...c, name } : c)
    update(next)
    setEditingCat(null)
  }

  const deleteCategory = (idx) => {
    if (!window.confirm('Delete this category and all its tricks?')) return
    update(categories.filter((_, i) => i !== idx))
  }

  const addCategory = () => {
    if (!newCatName.trim()) return
    update([...categories, { name: newCatName.trim(), tricks: [] }])
    setNewCatName('')
    setShowAddCat(false)
  }

  const addTrick = (catIdx) => {
    if (!newTrickName.trim()) return
    const trick = { id: `custom_${Date.now()}`, name: newTrickName.trim(), level: newTrickLevel }
    const next = categories.map((c, i) => i === catIdx ? { ...c, tricks: [...c.tricks, trick] } : c)
    update(next)
    setAddingTrick(null)
    setNewTrickName('')
    setNewTrickLevel('beginner')
  }

  const saveTrickEdit = (catIdx, trickIdx) => {
    const next = categories.map((c, i) => i === catIdx
      ? { ...c, tricks: c.tricks.map((t, j) => j === trickIdx ? { ...t, name: editTrickName, level: editTrickLevel } : t) }
      : c
    )
    update(next)
    setEditingTrick(null)
  }

  const deleteTrick = (catIdx, trickIdx) => {
    const next = categories.map((c, i) => i === catIdx
      ? { ...c, tricks: c.tricks.filter((_, j) => j !== trickIdx) }
      : c
    )
    update(next)
  }

  if (!categories.length) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 13 }}>
        No skill tree data yet. Start the app on the Skills tab first.
      </div>
    )
  }

  return (
    <div>
      {categories.map((cat, catIdx) => {
        const isOpen = expanded[catIdx]
        const isEditingCat = editingCat === catIdx
        return (
          <div key={catIdx} className="card" style={{ marginBottom: 8, padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setExpanded(e => ({ ...e, [catIdx]: !e[catIdx] }))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-muted)', flexShrink: 0 }}>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {isEditingCat ? (
                <>
                  <input className="input" style={{ flex: 1, fontSize: 13 }} value={editCatName}
                    onChange={e => setEditCatName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') renameCategory(catIdx, editCatName) }} autoFocus />
                  <button onClick={() => renameCategory(catIdx, editCatName)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neon-green)', padding: 4 }}>
                    <Check size={14} />
                  </button>
                  <button onClick={() => setEditingCat(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{cat.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cat.tricks.length} tricks</span>
                  <button onClick={() => { setEditingCat(catIdx); setEditCatName(cat.name) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => deleteCategory(catIdx)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neon-magenta)', padding: 4 }}>
                    <Trash2 size={13} />
                  </button>
                </>
              )}
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}>
                  <div style={{ marginTop: 8 }}>
                    {cat.tricks.map((trick, trickIdx) => {
                      const dc = DIFFICULTY_COLORS[trick.level] || DIFFICULTY_COLORS.beginner
                      const trickKey = `${catIdx}-${trickIdx}`
                      const isEditingTrick = editingTrick === trickKey
                      return (
                        <div key={trick.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0',
                          borderBottom: '1px solid var(--border)' }}>
                          {isEditingTrick ? (
                            <>
                              <input className="input" style={{ flex: 1, fontSize: 12, padding: '4px 8px' }} value={editTrickName}
                                onChange={e => setEditTrickName(e.target.value)} autoFocus />
                              <select className="input" style={{ width: 110, fontSize: 11, padding: '4px 6px' }}
                                value={editTrickLevel} onChange={e => setEditTrickLevel(e.target.value)}>
                                {Object.keys(DIFFICULTY_COLORS).map(l => <option key={l} value={l}>{l}</option>)}
                              </select>
                              <button onClick={() => saveTrickEdit(catIdx, trickIdx)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neon-green)', padding: 2 }}>
                                <Check size={13} />
                              </button>
                              <button onClick={() => setEditingTrick(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                                <X size={13} />
                              </button>
                            </>
                          ) : (
                            <>
                              <span style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)' }}>{trick.name}</span>
                              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 8, fontWeight: 700,
                                color: dc.color, background: dc.bg }}>{trick.level}</span>
                              <button onClick={() => { setEditingTrick(trickKey); setEditTrickName(trick.name); setEditTrickLevel(trick.level) }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                                <Pencil size={12} />
                              </button>
                              <button onClick={() => deleteTrick(catIdx, trickIdx)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--neon-magenta)', padding: 2 }}>
                                <Trash2 size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      )
                    })}

                    {addingTrick === catIdx ? (
                      <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <input className="input" style={{ flex: 1, minWidth: 120, fontSize: 12, padding: '6px 10px' }}
                          placeholder="Trick name" value={newTrickName} onChange={e => setNewTrickName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') addTrick(catIdx) }} autoFocus />
                        <select className="input" style={{ width: 110, fontSize: 11, padding: '6px 8px' }}
                          value={newTrickLevel} onChange={e => setNewTrickLevel(e.target.value)}>
                          {Object.keys(DIFFICULTY_COLORS).map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <button className="btn btn-cyan" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => addTrick(catIdx)}>
                          <Check size={12} /> Add
                        </button>
                        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 10px' }} onClick={() => { setAddingTrick(null); setNewTrickName('') }}>
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => { setAddingTrick(catIdx); setNewTrickName('') }} style={{
                        display: 'flex', alignItems: 'center', gap: 6, marginTop: 8,
                        background: 'none', border: '1.5px dashed rgba(224,71,158,0.25)',
                        color: 'var(--neon-cyan)', borderRadius: 10, padding: '6px 12px',
                        cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 700,
                      }}>
                        <Plus size={12} /> Add trick
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}

      <AnimatePresence>
        {showAddCat ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}>
            <div className="card" style={{ display: 'flex', gap: 8, alignItems: 'center', borderColor: 'var(--neon-cyan)' }}>
              <input className="input" style={{ flex: 1, fontSize: 13 }} placeholder="New category name"
                value={newCatName} onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addCategory() }} autoFocus />
              <button className="btn btn-cyan" style={{ fontSize: 12, padding: '7px 14px' }} onClick={addCategory}>
                <Check size={13} /> Add
              </button>
              <button className="btn btn-ghost" style={{ fontSize: 12, padding: '7px 10px' }} onClick={() => { setShowAddCat(false); setNewCatName('') }}>
                <X size={13} />
              </button>
            </div>
          </motion.div>
        ) : (
          <button onClick={() => setShowAddCat(true)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '12px', borderRadius: 14, cursor: 'pointer', marginTop: 4,
            background: 'none', border: '1.5px dashed rgba(224,71,158,0.3)',
            color: 'var(--neon-cyan)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
          }}>
            <Plus size={14} /> Add Category
          </button>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- Trick Library ---
function TrickLibrary() {
  const [diffFilter, setDiffFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [added, setAdded] = useState({})
  const [pickingFor, setPickingFor] = useState(null)
  const [categories, setCategories] = useState(() => loadCategories() || [])

  const libCategories = [...new Set(TRICK_LIBRARY.map(t => t.category))]
  const difficulties = ['beginner', 'intermediate', 'advanced', 'elite']

  const filtered = TRICK_LIBRARY.filter(t => {
    if (diffFilter !== 'all' && t.difficulty !== diffFilter) return false
    if (catFilter !== 'all' && t.category !== catFilter) return false
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const addToCategory = (trick, catIdx) => {
    const cats = loadCategories() || []
    const existing = cats[catIdx]?.tricks?.find(t => t.name === trick.name)
    if (existing) { setPickingFor(null); return }
    const newTrick = { id: `lib_added_${Date.now()}`, name: trick.name, level: trick.difficulty }
    const next = cats.map((c, i) => i === catIdx ? { ...c, tricks: [...c.tricks, newTrick] } : c)
    saveCategories(next)
    setCategories(next)
    setAdded(a => ({ ...a, [trick.id]: true }))
    setPickingFor(null)
  }

  return (
    <div>
      <input className="input" placeholder="Search tricks..." value={search}
        onChange={e => setSearch(e.target.value)} style={{ marginBottom: 10, fontSize: 13 }} />

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
        <button onClick={() => setDiffFilter('all')} style={{
          padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11,
          fontFamily: 'var(--font-body)', fontWeight: 700,
          background: diffFilter === 'all' ? 'var(--neon-cyan-dim)' : 'rgba(255,255,255,0.6)',
          color: diffFilter === 'all' ? 'var(--neon-cyan)' : 'var(--text-muted)',
          border: `1px solid ${diffFilter === 'all' ? 'var(--neon-cyan)' : 'var(--border)'}`,
        }}>All levels</button>
        {difficulties.map(d => {
          const dc = DIFFICULTY_COLORS[d]
          return (
            <button key={d} onClick={() => setDiffFilter(d)} style={{
              padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11,
              fontFamily: 'var(--font-body)', fontWeight: 700,
              background: diffFilter === d ? dc.bg : 'rgba(255,255,255,0.6)',
              color: diffFilter === d ? dc.color : 'var(--text-muted)',
              border: `1px solid ${diffFilter === d ? dc.color : 'var(--border)'}`,
            }}>{d}</button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
        <button onClick={() => setCatFilter('all')} style={{
          padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11,
          fontFamily: 'var(--font-body)', fontWeight: 700,
          background: catFilter === 'all' ? 'rgba(224,71,158,0.12)' : 'rgba(255,255,255,0.6)',
          color: catFilter === 'all' ? 'var(--neon-magenta)' : 'var(--text-muted)',
          border: `1px solid ${catFilter === 'all' ? 'var(--neon-magenta)' : 'var(--border)'}`,
        }}>All styles</button>
        {libCategories.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={{
            padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11,
            fontFamily: 'var(--font-body)', fontWeight: 700,
            background: catFilter === c ? 'rgba(224,71,158,0.12)' : 'rgba(255,255,255,0.6)',
            color: catFilter === c ? 'var(--neon-magenta)' : 'var(--text-muted)',
            border: `1px solid ${catFilter === c ? 'var(--neon-magenta)' : 'var(--border)'}`,
          }}>{c}</button>
        ))}
      </div>

      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{filtered.length} tricks</div>

      {filtered.map(trick => {
        const dc = DIFFICULTY_COLORS[trick.difficulty]
        const isPickingThis = pickingFor === trick.id
        return (
          <div key={trick.id} style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
              background: 'rgba(255,255,255,0.7)', borderRadius: 12, border: '1px solid var(--border)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{trick.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{trick.category}</div>
              </div>
              <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 8, fontWeight: 700,
                color: dc.color, background: dc.bg, flexShrink: 0 }}>{trick.difficulty}</span>
              {added[trick.id] ? (
                <span style={{ fontSize: 11, color: 'var(--neon-green)', fontWeight: 700, flexShrink: 0 }}>Added</span>
              ) : (
                <button onClick={() => setPickingFor(isPickingThis ? null : trick.id)} style={{
                  background: isPickingThis ? 'var(--neon-cyan-dim)' : 'none',
                  border: `1px solid ${isPickingThis ? 'var(--neon-cyan)' : 'var(--border)'}`,
                  borderRadius: 8, cursor: 'pointer', color: 'var(--neon-cyan)',
                  fontSize: 11, fontWeight: 700, padding: '4px 10px', fontFamily: 'var(--font-body)', flexShrink: 0,
                }}>
                  <Plus size={11} style={{ display: 'inline', marginRight: 3 }} />Add
                </button>
              )}
            </div>

            <AnimatePresence>
              {isPickingThis && categories.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '6px 12px 8px', background: 'rgba(224,71,158,0.06)',
                    borderRadius: '0 0 12px 12px', border: '1px solid var(--neon-cyan)', borderTop: 'none', marginTop: -1 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Add to which category?</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {categories.map((cat, i) => (
                        <button key={i} onClick={() => addToCategory(trick, i)} style={{
                          padding: '5px 12px', borderRadius: 20, border: '1px solid var(--neon-cyan)',
                          background: 'var(--neon-cyan-dim)', color: 'var(--neon-cyan)',
                          cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 700,
                        }}>{cat.name}</button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              {isPickingThis && categories.length === 0 && (
                <div style={{ padding: '8px 12px', fontSize: 12, color: 'var(--text-muted)' }}>
                  No categories yet — create one in the Skill Tree section above.
                </div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

// --- Main Settings Component ---
export default function SettingsPanel() {
  const [section, setSection] = useState('skilltree')

  return (
    <div style={{ padding: '0 0 80px' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'rgba(255,255,255,0.6)',
        padding: 4, borderRadius: 14, border: '1px solid var(--border)' }}>
        {[
          { id: 'skilltree', label: 'Skill Tree', icon: <Settings2 size={13} /> },
          { id: 'library',   label: 'Trick Library', icon: <BookOpen size={13} /> },
        ].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, letterSpacing: '0.05em',
            background: section === s.id ? 'rgba(255,255,255,0.9)' : 'transparent',
            color: section === s.id ? 'var(--neon-cyan)' : 'var(--text-secondary)',
            boxShadow: section === s.id ? '0 2px 8px rgba(224,71,158,0.1)' : 'none',
            transition: 'all 0.2s',
          }}>{s.icon} {s.label.toUpperCase()}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {section === 'skilltree' ? <SkillTreeManager /> : <TrickLibrary />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
