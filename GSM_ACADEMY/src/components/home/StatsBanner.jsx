import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: '25+', label: 'Years Active', sub: 'EXP Level', icon: '🏆', color: '#FF6F3C' },
  { value: '10K+', label: 'Heroes Trained', sub: 'Active Players', icon: '🛡️', color: '#F5B041' },
  { value: '50+', label: 'Expert Gurus', sub: 'Master Guild', icon: '🔮', color: '#2ECC71' },
  { value: '12+', label: 'Skill Trees', sub: 'Art Forms', icon: '⚡', color: '#3498DB' },
  { value: '200+', label: 'Quest Events', sub: 'Boss Raids', icon: '⚔️', color: '#9B59B6' },
  { value: '98%', label: 'Success Rate', sub: 'Clear Rate', icon: '❤️', color: '#E74C3C' },
]

const ticker = [
  '✦ Bharatanatyam performance',
  '✦ Kathak quest',
  '✦ Tabla rhythm beat',
  '✦ Vocal Music melody',
  '✦ Flute high score',
  '✦ Painting skill',
  '✦ Sanskrit scroll',
  '✦ Chess dungeon',
  '✦ Veena loot',
  '✦ Mridangam combo',
  '✦ Odissi dance',
  '✦ Manipuri level',
]

const StatsBanner = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <>
      {/* Level 2 Divider Connector */}
      <div className="level-connector">
        <div className="level-flag">LEVEL 2: STATS SCOREBOARD</div>
      </div>

      {/* Retro LED Marquee Banner Ticker */}
      <div 
        style={{ 
          overflow: 'hidden', 
          padding: '16px 0', 
          position: 'relative', 
          background: '#1D2A44', 
          borderBottom: '4px solid #FF6F3C' 
        }}
      >
        <motion.div
          style={{ display: 'flex', gap: 32, whiteSpace: 'nowrap' }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          {[...ticker, ...ticker].map((item, i) => (
            <span
              key={i}
              className="font-pixel"
              style={{ 
                fontSize: '10px', 
                letterSpacing: '1px', 
                flexShrink: 0, 
                color: i % 2 === 0 ? '#F5B041' : '#FDF6E3' 
              }}
            >
              {item.toUpperCase()}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scoreboard Cards */}
      <section id="stats" ref={ref} style={{ padding: '80px 0', position: 'relative', overflow: 'hidden', background: '#FDF6E3' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="font-pixel" style={{ fontSize: '9px', color: '#FF6F3C', margin: '0 0 10px 0' }}>LEADERBOARD STATS</p>
            <h2 className="font-arcade" style={{ fontSize: '28px', color: '#1D2A44', margin: 0 }}>HIGH SCOREBOARD</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20 }} className="stats-grid">
            <style>{`.stats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px; } @media(max-width:1024px){.stats-grid{grid-template-columns:repeat(3,1fr);}} @media(max-width:768px){.stats-grid{grid-template-columns:repeat(2,1fr);}}`}</style>
            
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 25 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="arcade-card"
                style={{ 
                  padding: '24px 16px', 
                  textAlign: 'center',
                  background: 'rgba(253, 246, 227, 0.9)',
                  boxShadow: '4px 4px 0px #1D2A44'
                }}
                whileHover={{ scale: 1.05, translateY: -3 }}
              >
                {/* Pixel Icon Badge */}
                <div style={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 14px', 
                  background: '#1D2A44', 
                  border: `2px solid ${s.color}`,
                  fontSize: '20px',
                  boxShadow: `0px 0px 8px ${s.color}66`
                }}>
                  {s.icon}
                </div>

                <p 
                  className="font-pixel" 
                  style={{ 
                    fontWeight: 'bold', 
                    fontSize: '18px', 
                    color: '#1D2A44', 
                    margin: 0 
                  }}
                >
                  {s.value}
                </p>

                <p className="font-arcade" style={{ fontSize: '11px', fontWeight: 'bold', marginTop: 8, marginBottom: 2, color: s.color }}>
                  {s.label.toUpperCase()}
                </p>
                
                <p style={{ fontSize: '11px', color: '#5D6D7E', margin: 0 }}>
                  {s.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default StatsBanner
