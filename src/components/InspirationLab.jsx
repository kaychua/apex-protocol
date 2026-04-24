import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Link, Heart, Image, Palette, X, ExternalLink, Globe } from 'lucide-react'

const PRESET_PALETTES = [
  ['#ff00a8','#9d4edd','#00f5ff','#0a0a0f'],
  ['#ff6b35','#f7c59f','#1a1a2e','#e2e2e2'],
  ['#39ff14','#00f5ff','#0a0a0f','#1d1d2a'],
  ['#ffb300','#ff5050','#1a0a00','#2a1500'],
  ['#e040fb','#7c4dff','#18ffff','#0d0d1a'],
]

function InspirationCard({ item, onDelete }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="card" style={{ marginBottom: 10, borderColor: 'var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <Heart size={16} style={{ color: 'var(--neon-magenta)', marginTop: 2, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 4,
              color: 'var(--neon-cyan)', fontSize: 13, marginBottom: 4,
              textDecoration: 'none', wordBreak: 'break-all',
            }}>
              <ExternalLink size={12} /> {item.url.length > 40 ? item.url.slice(0, 40) + '…' : item.url}
            </a>
          )}
          {item.caption && <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
            {item.platform && <span style={{ color: 'var(--neon-magenta)', marginRight: 6 }}>@{item.platform}</span>}
            {item.caption}
          </div>}
          {item.why && (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '2px solid var(--neon-magenta)', paddingLeft: 8 }}>
              "{item.why}"
            </div>
          )}
          {item.tags && item.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
              {item.tags.map(tag => (
                <span key={tag} style={{ fontSize: 11, padding: '1px 7px', borderRadius: 10,
                  background: 'var(--neon-purple-dim)', color: 'var(--neon-purple)', fontWeight: 600 }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <button className="btn btn-danger" style={{ padding: '4px 8px' }} onClick={onDelete}><Trash2 size={13} /></button>
      </div>
    </motion.div>
  )
}

function MoodBoardItem({ item, onDelete }) {
  if (item.type === 'link') {
    let hostname = item.value
    try { hostname = new URL(item.value).hostname.replace('www.', '') } catch {}
    return (
      <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '1',
          border: '1px solid var(--neon-cyan)', background: 'linear-gradient(135deg, rgba(224,71,158,0.12), rgba(155,111,232,0.12))' }}>
        <a href={item.value} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            width: '100%', height: '100%', textDecoration: 'none', padding: 8, gap: 4 }}>
          <Globe size={18} style={{ color: 'var(--neon-cyan)' }} />
          <div style={{ fontSize: 9, color: 'var(--text-secondary)', textAlign: 'center', wordBreak: 'break-all', lineHeight: 1.3 }}>
            {item.label || hostname}
          </div>
        </a>
        <button onClick={onDelete} style={{
          position: 'absolute', top: 4, right: 4, background: 'rgba(255,255,255,0.85)',
          border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neon-magenta)',
        }}><X size={10} /></button>
      </motion.div>
    )
  }

  const isColor = item.type === 'color'
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '1',
        border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
      {isColor ? (
        <div style={{ width: '100%', height: '100%', background: item.value }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 6px',
            background: 'rgba(0,0,0,0.7)', fontSize: 10, fontFamily: 'monospace', color: '#fff',
            textAlign: 'center' }}>{item.value}</div>
        </div>
      ) : (
        <img src={item.value} alt={item.label || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => {
          e.target.parentElement.style.background = 'var(--bg-surface)'
          e.target.style.display = 'none'
        }} />
      )}
      {item.label && !isColor && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 6px',
          background: 'rgba(0,0,0,0.75)', fontSize: 11, color: '#fff', textAlign: 'center' }}>{item.label}</div>
      )}
      <button onClick={onDelete} style={{
        position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)',
        border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff5050',
      }}><X size={10} /></button>
    </motion.div>
  )
}

export default function InspirationLab() {
  const [tab, setTab] = useState('links')

  const [links, setLinks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('inspirationLinks') || '[]') } catch { return [] }
  })
  const [board, setBoard] = useState(() => {
    try { return JSON.parse(localStorage.getItem('moodBoard') || '[]') } catch { return [] }
  })

  const [linkForm, setLinkForm] = useState({ url: '', platform: '', caption: '', why: '', tags: '' })
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [colorInput, setColorInput] = useState('#ff00a8')
  const [imgUrl, setImgUrl] = useState('')
  const [imgLabel, setImgLabel] = useState('')
  const [boardLinkUrl, setBoardLinkUrl] = useState('')
  const [boardLinkLabel, setBoardLinkLabel] = useState('')

  const saveLinks = (data) => { setLinks(data); localStorage.setItem('inspirationLinks', JSON.stringify(data)) }
  const saveBoard = (data) => { setBoard(data); localStorage.setItem('moodBoard', JSON.stringify(data)) }

  const addLink = () => {
    if (!linkForm.url.trim() && !linkForm.caption.trim()) return
    const tags = linkForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    saveLinks([...links, { ...linkForm, tags, id: Date.now() }])
    setLinkForm({ url: '', platform: '', caption: '', why: '', tags: '' })
    setShowLinkForm(false)
  }

  const addColor = (hex) => {
    if (!hex) return
    saveBoard([...board, { id: Date.now(), type: 'color', value: hex }])
  }

  const addImage = () => {
    if (!imgUrl.trim()) return
    saveBoard([...board, { id: Date.now(), type: 'image', value: imgUrl, label: imgLabel }])
    setImgUrl(''); setImgLabel('')
  }

  const addBoardLink = () => {
    if (!boardLinkUrl.trim()) return
    saveBoard([...board, { id: Date.now(), type: 'link', value: boardLinkUrl, label: boardLinkLabel }])
    setBoardLinkUrl(''); setBoardLinkLabel('')
  }

  return (
    <div style={{ padding: '0 0 80px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--bg-card)', padding: 4, borderRadius: 8, border: '1px solid var(--border)' }}>
        {[
          { id: 'links', label: 'Saved Links', icon: <Link size={13} /> },
          { id: 'board', label: 'Mood Board', icon: <Palette size={13} /> },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '7px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, letterSpacing: '0.06em',
            background: tab === t.id ? 'var(--neon-magenta-dim)' : 'transparent',
            color: tab === t.id ? 'var(--neon-magenta)' : 'var(--text-secondary)',
            transition: 'all 0.2s',
          }}>{t.icon} {t.label.toUpperCase()}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'links' ? (
          <motion.div key="links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="btn btn-magenta" style={{ width: '100%', justifyContent: 'center', marginBottom: 12 }}
              onClick={() => setShowLinkForm(s => !s)}>
              <Plus size={15} /> SAVE INSPIRATION
            </button>
            <AnimatePresence>
              {showLinkForm && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginBottom: 12 }}>
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8, borderColor: 'var(--neon-magenta)' }}>
                    <input className="input" placeholder="Instagram / TikTok / YouTube URL" value={linkForm.url}
                      onChange={e => setLinkForm(p => ({ ...p, url: e.target.value }))} />
                    <input className="input" placeholder="Creator / @handle" value={linkForm.platform}
                      onChange={e => setLinkForm(p => ({ ...p, platform: e.target.value }))} />
                    <input className="input" placeholder="What trick / concept is this?" value={linkForm.caption}
                      onChange={e => setLinkForm(p => ({ ...p, caption: e.target.value }))} />
                    <textarea className="input" placeholder="Why I love this — what inspires me about it..." value={linkForm.why}
                      onChange={e => setLinkForm(p => ({ ...p, why: e.target.value }))} />
                    <input className="input" placeholder="Tags (comma separated): flex, transitions, floorwork" value={linkForm.tags}
                      onChange={e => setLinkForm(p => ({ ...p, tags: e.target.value }))} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-magenta" onClick={addLink}><Plus size={13} /> SAVE</button>
                      <button className="btn btn-ghost" onClick={() => setShowLinkForm(false)}>CANCEL</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {links.length === 0
              ? <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <Heart size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
                  <p style={{ fontSize: 14 }}>Save links that inspire your training.</p>
                </div>
              : links.map(item => (
                  <InspirationCard key={item.id} item={item} onDelete={() => saveLinks(links.filter(l => l.id !== item.id))} />
                ))
            }
          </motion.div>
        ) : (
          <motion.div key="board" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Color palette presets */}
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>PRESET PALETTES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {PRESET_PALETTES.map((pal, i) => (
                  <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <div style={{ display: 'flex', flex: 1, borderRadius: 4, overflow: 'hidden', height: 28, cursor: 'pointer' }}
                      onClick={() => pal.forEach(c => addColor(c))}>
                      {pal.map(c => <div key={c} style={{ flex: 1, background: c }} />)}
                    </div>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 11 }}
                      onClick={() => pal.forEach(c => addColor(c))}>ADD</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom color */}
            <div className="card" style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={colorInput} onChange={e => setColorInput(e.target.value)}
                style={{ width: 40, height: 36, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 4 }} />
              <input className="input" style={{ flex: 1 }} value={colorInput}
                onChange={e => setColorInput(e.target.value)} placeholder="#hex" />
              <button className="btn btn-cyan" style={{ whiteSpace: 'nowrap' }} onClick={() => addColor(colorInput)}>
                <Plus size={13} /> ADD
              </button>
            </div>

            {/* Image URL */}
            <div className="card" style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>ADD IMAGE BY URL</div>
              <input className="input" placeholder="https://... (image URL)" value={imgUrl} onChange={e => setImgUrl(e.target.value)} />
              <input className="input" placeholder="Label (optional)" value={imgLabel} onChange={e => setImgLabel(e.target.value)} />
              <button className="btn btn-purple" onClick={addImage}><Image size={13} /> ADD TO BOARD</button>
            </div>

            {/* Link to board */}
            <div className="card" style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>ADD LINK TO BOARD</div>
              <input className="input" placeholder="https://... (any URL)" value={boardLinkUrl} onChange={e => setBoardLinkUrl(e.target.value)} />
              <input className="input" placeholder="Label (optional, e.g. Inspo reel)" value={boardLinkLabel} onChange={e => setBoardLinkLabel(e.target.value)} />
              <button className="btn btn-cyan" onClick={addBoardLink}><Globe size={13} /> ADD LINK</button>
            </div>

            {/* Board grid */}
            {board.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <AnimatePresence>
                  {board.map(item => (
                    <MoodBoardItem key={item.id} item={item} onDelete={() => saveBoard(board.filter(b => b.id !== item.id))} />
                  ))}
                </AnimatePresence>
              </div>
            )}
            {board.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                <Palette size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
                <p style={{ fontSize: 14 }}>Build your competition concept board.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
