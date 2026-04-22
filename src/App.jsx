import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Heart, Dumbbell, Shield, Wind, Settings } from 'lucide-react'
import SkillTree from './components/SkillTree'
import InspirationLab from './components/InspirationLab'
import StrengthLog from './components/StrengthLog'
import Mastery from './components/Mastery'
import FreestyleStamina from './components/FreestyleStamina'
import SettingsPanel from './components/Settings'

const TABS = [
  { id: 'skills',    label: 'SKILL TREE', icon: Zap,      color: 'var(--neon-cyan)',    short: 'Skills' },
  { id: 'lab',       label: 'INSPO LAB',  icon: Heart,    color: 'var(--neon-magenta)', short: 'Inspo' },
  { id: 'strength',  label: 'STRENGTH',   icon: Dumbbell, color: 'var(--neon-amber)',   short: 'Lift' },
  { id: 'mastery',   label: 'MASTERY',    icon: Shield,   color: 'var(--neon-purple)',  short: 'Master' },
  { id: 'freestyle', label: 'FREESTYLE',  icon: Wind,     color: 'var(--neon-green)',   short: 'Flow' },
  { id: 'settings',  label: 'SETTINGS',   icon: Settings, color: 'var(--text-secondary)', short: 'Settings' },
]

const COMPONENTS = {
  skills:    SkillTree,
  lab:       InspirationLab,
  strength:  StrengthLog,
  mastery:   Mastery,
  freestyle: FreestyleStamina,
  settings:  SettingsPanel,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('skills')
  const ActiveComp = COMPONENTS[activeTab]
  const activeTabData = TABS.find(t => t.id === activeTab)

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(253, 242, 248, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(240, 195, 220, 0.5)',
        padding: 'env(safe-area-inset-top, 0) 0 0',
      }}>
        <div style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
              fontStyle: 'italic', color: 'var(--neon-cyan)', letterSpacing: '-0.01em',
              lineHeight: 1,
            }}>
              Pole Kitten
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.18em', marginTop: 2,
              fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase' }}>
              Training Journal
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--neon-green)',
              boxShadow: '0 0 8px var(--neon-green)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 600 }}>LIVE</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            style={{ padding: '2px 18px 9px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <activeTabData.icon size={12} style={{ color: activeTabData.color }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800,
              letterSpacing: '0.12em', color: activeTabData.color }}>
              {activeTabData.label}
            </span>
          </motion.div>
        </AnimatePresence>
      </header>

      {/* Content */}
      <main style={{ flex: 1, padding: '16px 14px 0', maxWidth: 600, width: '100%', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
            <ActiveComp />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom nav — 6 tabs */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(253, 242, 248, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(240, 195, 220, 0.5)',
        paddingBottom: 'env(safe-area-inset-bottom, 6px)',
      }}>
        <div style={{ display: 'flex', maxWidth: 600, margin: '0 auto' }}>
          {TABS.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} whileTap={{ scale: 0.85 }}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', padding: '8px 2px 6px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: active ? tab.color : 'var(--text-muted)',
                  transition: 'color 0.18s', position: 'relative',
                }}>
                {active && (
                  <motion.div layoutId="navIndicator" style={{
                    position: 'absolute', top: 0, left: '10%', right: '10%',
                    height: 2.5, background: tab.color,
                    borderRadius: '0 0 4px 4px',
                    boxShadow: `0 1px 6px ${tab.color}80`,
                  }} />
                )}
                <div style={{
                  padding: '4px 8px', borderRadius: 16,
                  background: active ? `${tab.color}14` : 'transparent',
                  transition: 'background 0.18s',
                }}>
                  <Icon size={17} />
                </div>
                <span style={{
                  fontSize: 8.5, fontFamily: 'var(--font-body)',
                  fontWeight: active ? 800 : 500, letterSpacing: '0.04em', marginTop: 1,
                }}>{tab.short.toUpperCase()}</span>
              </motion.button>
            )
          })}
        </div>
      </nav>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
      `}</style>
    </div>
  )
}
