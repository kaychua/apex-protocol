import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Heart, Dumbbell, Shield, Wind } from 'lucide-react'
import SkillTree from './components/SkillTree'
import InspirationLab from './components/InspirationLab'
import StrengthLog from './components/StrengthLog'
import Mastery from './components/Mastery'
import FreestyleStamina from './components/FreestyleStamina'

const TABS = [
  { id: 'skills',    label: 'SKILL TREE',   icon: Zap,      color: 'var(--neon-cyan)',    short: 'Skills' },
  { id: 'lab',       label: 'INSPO LAB',    icon: Heart,    color: 'var(--neon-magenta)', short: 'Inspo' },
  { id: 'strength',  label: 'STRENGTH',     icon: Dumbbell, color: 'var(--neon-amber)',   short: 'Lift' },
  { id: 'mastery',   label: 'MASTERY',      icon: Shield,   color: 'var(--neon-purple)',  short: 'Master' },
  { id: 'freestyle', label: 'FREESTYLE',    icon: Wind,     color: 'var(--neon-green)',   short: 'Flow' },
]

const COMPONENTS = {
  skills:    SkillTree,
  lab:       InspirationLab,
  strength:  StrengthLog,
  mastery:   Mastery,
  freestyle: FreestyleStamina,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('skills')
  const ActiveComp = COMPONENTS[activeTab]
  const activeTabData = TABS.find(t => t.id === activeTab)

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Top header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(253, 242, 248, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(240, 195, 220, 0.5)',
        padding: 'env(safe-area-inset-top, 0) 0 0',
      }}>
        <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--neon-cyan)',
              letterSpacing: '-0.01em' }}>
              Apex Protocol
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.12em', marginTop: 1, fontFamily: 'var(--font-body)', fontWeight: 600 }}>
              ELITE ATHLETE DASHBOARD
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--neon-green)',
              boxShadow: '0 0 8px var(--neon-green)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 600 }}>LIVE</span>
          </div>
        </div>

        {/* Section title bar */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            style={{ padding: '4px 18px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <activeTabData.icon size={13} style={{ color: activeTabData.color }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', color: activeTabData.color }}>
              {activeTabData.label}
            </span>
          </motion.div>
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, padding: '16px 14px 0', maxWidth: 600, width: '100%', margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <ActiveComp />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(253, 242, 248, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(240, 195, 220, 0.5)',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      }}>
        <div style={{ display: 'flex', maxWidth: 600, margin: '0 auto' }}>
          {TABS.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.88 }}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '10px 4px 8px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: active ? tab.color : 'var(--text-muted)',
                  transition: 'color 0.2s',
                  position: 'relative',
                }}
              >
                {active && (
                  <motion.div layoutId="navIndicator" style={{
                    position: 'absolute', top: 0, left: '15%', right: '15%',
                    height: 3, background: tab.color,
                    borderRadius: '0 0 6px 6px',
                    boxShadow: `0 2px 8px ${tab.color}80`,
                  }} />
                )}
                <div style={{
                  padding: '5px 12px', borderRadius: 20,
                  background: active ? `${tab.color}14` : 'transparent',
                  transition: 'background 0.2s',
                }}>
                  <Icon size={19} />
                </div>
                <span style={{
                  fontSize: 9, fontFamily: 'var(--font-body)', fontWeight: active ? 800 : 500,
                  letterSpacing: '0.05em', marginTop: 1,
                }}>{tab.short.toUpperCase()}</span>
              </motion.button>
            )
          })}
        </div>
      </nav>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
