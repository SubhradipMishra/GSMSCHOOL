import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiArrowRightLine, RiGamepadLine, RiSwordLine, RiHeartLine, RiCalendarCheckLine } from 'react-icons/ri'

const badges = [
  { icon: '🏆', label: 'Authentic Curriculum' },
  { icon: '⭐', label: 'Expert Gurus' },
  { icon: '⚡', label: 'Holistic Dev' },
  { icon: '❤️', label: 'Value Driven' },
]

const heroTabs = [
  {
    id: 'dance',
    title: 'Dance Quest',
    color: '#FF6F3C',
    initials: '💃',
    tagline: 'Level Up Grace & Expression',
    details: 'Learn Bharatanatyam and Kathak from master gurus. Unlock mudras and complex rhythmic patterns.',
    stats: { speed: 85, power: 90, stamina: 95 }
  },
  {
    id: 'music',
    title: 'Raga Quest',
    color: '#F5B041',
    initials: '🎼',
    tagline: 'Master Melody & Rhythm',
    details: 'Tabla, Vocal, and Veena quests. Connect with ancient swaras and rhythmic cycles of beat sequences.',
    stats: { speed: 70, power: 88, stamina: 92 }
  },
  {
    id: 'heritage',
    title: 'Veda Quest',
    color: '#3498DB',
    initials: '📜',
    tagline: 'Unlock Ancient Lore',
    details: 'Explore Sanskrit literature, Vedic arts, and heritage history. Enhance wisdom, focus, and memory.',
    stats: { speed: 60, power: 95, stamina: 85 }
  }
]

const Hero = () => {
  const [count, setCount] = useState(0)
  const [activeTab, setActiveTab] = useState('dance')

  useEffect(() => {
    const t = setInterval(() => setCount(p => p < 25 ? p + 1 : p), 60)
    return () => clearInterval(t)
  }, [])

  const currentTabInfo = heroTabs.find(t => t.id === activeTab)

  return (
    <section id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '120px 0 80px 0' }}>
      {/* Background patterns */}
      <div className="pattern-bg" style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }} />
      
      {/* Playful Pixel Watermark */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <span className="font-pixel" style={{ fontSize: '18rem', color: 'rgba(29, 42, 68, 0.025)', lineHeight: 1, userSelect: 'none' }}>GSM</span>
      </div>

      {/* Floating Retro Coins / Ornaments */}
      <motion.div 
        style={{ position: 'absolute', top: '15%', left: '8%', width: 24, height: 24, borderRadius: '50%', background: '#F5B041', border: '3px solid #1D2A44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '10px', color: '#1D2A44', zIndex: 1 }}
        animate={{ y: [0, -10, 0], rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        ★
      </motion.div>
      <motion.div 
        style={{ position: 'absolute', bottom: '15%', right: '8%', width: 20, height: 20, borderRadius: '4px', background: '#FF6F3C', border: '3px solid #1D2A44', zIndex: 1 }}
        animate={{ y: [0, 10, 0], rotate: 45 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center' }}>
          
          {/* ── Left Content (Start Screen UI) ── */}
          <div>
            {/* Mission Tag */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 8, 
                padding: '6px 14px', 
                borderRadius: '8px',
                background: '#EEDDC2', 
                border: '3px solid #1D2A44', 
                color: '#1D2A44',
                fontSize: '11px', 
                fontWeight: 700, 
                marginBottom: 20,
                boxShadow: '3px 3px 0px #1D2A44'
              }}
              className="font-arcade"
            >
              <span className="pulse-heart" style={{ color: '#FF6F3C' }}>❤️</span>
              MISSION: CULTURAL LEVEL UP
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ 
                fontWeight: 800, 
                lineHeight: 1.1, 
                marginBottom: 16, 
                color: '#1D2A44', 
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)' 
              }}
            >
              Preserving Heritage.<br />
              <span style={{ 
                color: '#FF6F3C',
                textShadow: '3px 3px 0px rgba(29, 42, 68, 0.15)',
                display: 'inline-block' 
              }}>Building Future</span><br />
              Generations.
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ 
                fontSize: '15px', 
                lineHeight: 1.7, 
                marginBottom: 32, 
                maxWidth: 520, 
                color: '#5D6D7E' 
              }}
            >
              GSM Academy is a premium cultural school blending ancient Indian knowledge systems with play-inspired digital dashboards. Master music, arts, and shastras like unlocking game levels.
            </motion.p>

            {/* Arcade Buttons (CTAs) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}
            >
              <a href="#courses" className="arcade-btn btn-primary" style={{ textDecoration: 'none', borderRadius: '12px', fontSize: '13px' }}>
                <RiGamepadLine size={18} /> ENTER COURSES [1P]
              </a>
              <a href="#about" className="arcade-btn btn-outline" style={{ textDecoration: 'none', borderRadius: '12px', fontSize: '13px' }}>
                <RiCalendarCheckLine size={16} /> BOOK VISIT
              </a>
            </motion.div>

            {/* Retro Scoreboard Statistics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 20, 
                padding: '20px', 
                background: 'rgba(238, 221, 194, 0.4)', 
                border: '3px dashed #1D2A44',
                borderRadius: '16px',
                marginBottom: 32,
                maxWidth: 540
              }}
            >
              {[
                { v: count + '+', l: 'Years Exp', c: '#FF6F3C' },
                { v: '10K+', l: 'Trained', c: '#F5B041' },
                { v: '50+', l: 'Gurus', c: '#2ECC71' },
                { v: '12+', l: 'Quests', c: '#3498DB' }
              ].map(s => (
                <div key={s.l} style={{ flex: '1 1 100px', textAlign: 'center' }}>
                  <p className="font-pixel" style={{ fontSize: '18px', color: s.c, margin: 0, fontWeight: 'bold' }}>{s.v}</p>
                  <p className="font-arcade" style={{ fontSize: '10px', color: '#1D2A44', marginTop: 6, marginBottom: 0, fontWeight: 700 }}>{s.l}</p>
                </div>
              ))}
            </motion.div>

            {/* Micro Power-up Badges */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.7, delay: 0.5 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}
            >
              {badges.map((b, i) => (
                <motion.div 
                  key={b.label}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6, 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontSize: '11px',
                    fontWeight: 'bold',
                    background: '#FDF6E3', 
                    border: '2px solid #1D2A44', 
                    color: '#1D2A44',
                    boxShadow: '2px 2px 0px #1D2A44'
                  }}
                >
                  <span>{b.icon}</span>
                  <span>{b.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right Content (Interactive Handheld Retro Console) ── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ position: 'relative' }}
          >
            {/* Handheld Device Body (Gameboy Style) */}
            <div 
              style={{
                background: '#EEDDC2',
                border: '6px solid #1D2A44',
                borderRadius: '28px',
                padding: '24px 20px 32px 20px',
                boxShadow: '12px 12px 0px #1D2A44',
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
              }}
              className="crt-screen"
            >
              {/* Handheld Screen Frame */}
              <div 
                style={{
                  background: '#1D2A44',
                  border: '4px solid #1D2A44',
                  borderRadius: '16px',
                  padding: '16px',
                  color: '#FDF6E3',
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'inset 0px 4px 10px rgba(0,0,0,0.5)',
                  position: 'relative'
                }}
              >
                {/* Screen Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(253, 246, 227, 0.2)', paddingBottom: 8, marginBottom: 12 }}>
                  <span className="font-pixel" style={{ fontSize: '8px', color: '#FF6F3C' }}>STAGE_01</span>
                  <span className="font-pixel" style={{ fontSize: '8px', color: '#F5B041' }}>♥ ♥ ♥</span>
                </div>

                {/* Screen Content Box */}
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Character Sprite Icon */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          background: currentTabInfo.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          border: '2px solid #FDF6E3',
                          boxShadow: '2px 2px 0px rgba(255,255,255,0.2)'
                        }} className="float-effect">
                          {currentTabInfo.initials}
                        </div>
                        <div>
                          <h4 className="font-pixel" style={{ fontSize: '11px', color: '#FDF6E3', margin: 0 }}>{currentTabInfo.title}</h4>
                          <p className="font-arcade" style={{ fontSize: '10px', color: '#F5B041', margin: '4px 0 0 0' }}>{currentTabInfo.tagline}</p>
                        </div>
                      </div>

                      {/* Character Bio details */}
                      <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#CCD1D1', margin: '0 0 16px 0' }}>
                        {currentTabInfo.details}
                      </p>

                      {/* Character Skill Bars */}
                      <div style={{ spaceY: '6px' }}>
                        {Object.entries(currentTabInfo.stats).map(([stat, val]) => (
                          <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span className="font-pixel" style={{ fontSize: '7px', width: '48px', textTransform: 'uppercase', color: '#EEDDC2' }}>{stat}</span>
                            <div className="pixel-progress" style={{ height: '8px', flexGrow: 1, border: '1.5px solid #FDF6E3', background: 'rgba(0,0,0,0.3)', borderRadius: 2 }}>
                              <div className="pixel-progress-fill" style={{ width: `${val}%`, background: currentTabInfo.color, borderRight: 'none' }} />
                            </div>
                            <span className="font-pixel" style={{ fontSize: '7px', width: '22px', textAlign: 'right' }}>{val}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Screen Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 8, borderTop: '2px solid rgba(253, 246, 227, 0.1)' }}>
                  <span className="font-pixel" style={{ fontSize: '7px', color: '#2ECC71' }}>ONLINE ACTIVE</span>
                  <span className="font-pixel" style={{ fontSize: '7px', color: '#FDF6E3' }}>AUTO-SAVE</span>
                </div>
              </div>

              {/* Handheld Device Buttons Panel */}
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* D-Pad (Directional Buttons) */}
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <div style={{ position: 'absolute', left: '26px', top: '0', width: '28px', height: '80px', background: '#1D2A44', borderRadius: '4px' }} />
                  <div style={{ position: 'absolute', left: '0', top: '26px', width: '80px', height: '28px', background: '#1D2A44', borderRadius: '4px' }} />
                  {/* Center indentation */}
                  <div style={{ position: 'absolute', left: '28px', top: '28px', width: '24px', height: '24px', background: '#1D2A44' }} />
                  {/* Small direction pointers */}
                  <div style={{ position: 'absolute', left: '36px', top: '6px', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderBottom: '4px solid #EEDDC2' }} />
                  <div style={{ position: 'absolute', left: '36px', bottom: '6px', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #EEDDC2' }} />
                </div>

                {/* Interactive Screen Quest Toggles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '120px' }}>
                  {heroTabs.map(t => {
                    const isActive = activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className="font-arcade"
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: isActive ? '#FDF6E3' : '#1D2A44',
                          background: isActive ? '#1D2A44' : 'rgba(29, 42, 68, 0.08)',
                          border: '2px solid #1D2A44',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          boxShadow: isActive ? 'none' : '2px 2px 0px #1D2A44',
                          transform: isActive ? 'translate(2px, 2px)' : 'none',
                          transition: 'all 0.1s ease'
                        }}
                      >
                        {t.title}
                      </button>
                    );
                  })}
                </div>

                {/* Round Action Buttons (A / B) */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button 
                      onClick={() => {
                        // Cycles tabs
                        const currentIndex = heroTabs.findIndex(t => t.id === activeTab);
                        const nextIndex = (currentIndex + 1) % heroTabs.length;
                        setActiveTab(heroTabs[nextIndex].id);
                      }}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#FF6F3C', border: '3px solid #1D2A44', cursor: 'pointer', boxShadow: '2px 2px 0px #1D2A44' }} 
                    />
                    <span className="font-pixel" style={{ fontSize: '8px', marginTop: 4, color: '#1D2A44' }}>A</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button 
                      onClick={() => {
                        // Cycles tabs backward
                        const currentIndex = heroTabs.findIndex(t => t.id === activeTab);
                        const prevIndex = (currentIndex - 1 + heroTabs.length) % heroTabs.length;
                        setActiveTab(heroTabs[prevIndex].id);
                      }}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#F5B041', border: '3px solid #1D2A44', cursor: 'pointer', boxShadow: '2px 2px 0px #1D2A44' }} 
                    />
                    <span className="font-pixel" style={{ fontSize: '8px', marginTop: 4, color: '#1D2A44' }}>B</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Level Select Scroll Indicator */}
      <motion.div 
        style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 10 }}
        animate={{ y: [0, 6, 0] }} 
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <p className="font-pixel" style={{ fontSize: '7px', color: '#1D2A44', margin: 0, letterSpacing: '1px' }}>SCROLL TO LEVEL 2</p>
        <span style={{ fontSize: '10px', color: '#FF6F3C' }}>▼</span>
      </motion.div>
    </section>
  )
}

export default Hero
