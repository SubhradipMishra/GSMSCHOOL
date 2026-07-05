import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { RiInstagramLine, RiYoutubeLine, RiCompassDiscoverLine } from 'react-icons/ri'

const teachers = [
  { 
    id: 1, 
    name: 'Guru Radhika Nair', 
    role: 'Bharatanatyam Guru', 
    exp: 'Level 25 (25+ Yrs)', 
    initials: 'RN', 
    color: '#FF6F3C', 
    bg: 'linear-gradient(135deg, #1D2A44, #2E4057)', 
    award: 'National Award Winner', 
    students: '500+ Apprentices', 
    icon: '💃',
    skills: { Grace: 95, Rhythm: 90, Wisdom: 92 }
  },
  { 
    id: 2, 
    name: 'Pt. Suresh Kumar', 
    role: 'Tabla Maestro', 
    exp: 'Level 30 (30+ Yrs)', 
    initials: 'SK', 
    color: '#F5B041', 
    bg: 'linear-gradient(135deg, #2D1E10, #4A321A)', 
    award: 'Sangeet Natak Akademi', 
    students: '700+ Apprentices', 
    icon: '🥁',
    skills: { Grace: 70, Rhythm: 98, Wisdom: 95 }
  },
  { 
    id: 3, 
    name: 'Smt. Priya Menon', 
    role: 'Kathak Mentor', 
    exp: 'Level 20 (20+ Yrs)', 
    initials: 'PM', 
    color: '#E74C3C', 
    bg: 'linear-gradient(135deg, #3A1A2A, #5A2A42)', 
    award: 'State Kalakara Award', 
    students: '400+ Apprentices', 
    icon: '✨',
    skills: { Grace: 92, Rhythm: 88, Wisdom: 90 }
  },
  { 
    id: 4, 
    name: 'Dr. Anand Verma', 
    role: 'Sanskrit Scholar', 
    exp: 'Level 22 (22+ Yrs)', 
    initials: 'AV', 
    color: '#3498DB', 
    bg: 'linear-gradient(135deg, #1A1A3A, #2C2C60)', 
    award: 'PhD Sanskrit, BHU', 
    students: '350+ Apprentices', 
    icon: '📜',
    skills: { Grace: 65, Rhythm: 70, Wisdom: 99 }
  },
]

const Teachers = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <>
      {/* Level 6 Connector */}
      <div className="level-connector">
        <div className="level-flag">LEVEL 6: THE MASTERS GUILD</div>
      </div>

      <section id="teachers" ref={ref} style={{ padding: '96px 0', position: 'relative', overflow: 'hidden', background: '#FDF6E3' }}>
        {/* Pixel patterns */}
        <div className="pattern-bg" style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="font-pixel" style={{ fontSize: '9px', color: '#FF6F3C', margin: '0 0 12px 0' }}>GUILD MASTERS</p>
            <h2 className="font-arcade" style={{ fontSize: '32px', color: '#1D2A44', margin: '0 0 16px 0' }}>MEET OUR HERO CLASS</h2>
            <p style={{ color: '#5D6D7E', fontSize: '15px', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
              Unlock the profiles of our award-winning gurus and masters. Unlock hidden potential by learning directly from legends.
            </p>
          </div>

          {/* Character Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {teachers.map((t, i) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: 30 }} 
                animate={inView ? { opacity: 1, y: 0 } : {}} 
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="arcade-card"
                style={{ borderRadius: 20, overflow: 'hidden', background: '#FDF6E3' }}
                whileHover={{ scale: 1.03, translateY: -2 }}
              >
                {/* Character Card Hero Image Frame */}
                <div style={{ 
                  position: 'relative', 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: t.bg,
                  borderBottom: '3px solid #1D2A44'
                }} className="crt-screen">
                  {/* Neon retro grids inside character image block */}
                  <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', border: '2px dashed rgba(253, 246, 227, 0.15)' }} />
                  
                  {/* Initials Sprite */}
                  <motion.div 
                    style={{ 
                      position: 'relative', 
                      zIndex: 2, 
                      width: 90, 
                      height: 90, 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'rgba(253, 246, 227, 0.1)', 
                      border: `3px solid ${t.color}`,
                      boxShadow: `0 0 12px ${t.color}55`
                    }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                  >
                    <span className="font-arcade" style={{ fontWeight: 'bold', fontSize: '32px', color: '#FDF6E3' }}>{t.initials}</span>
                  </motion.div>

                  {/* Character Class Icon */}
                  <div style={{ 
                    position: 'absolute', 
                    top: 14, 
                    right: 14, 
                    width: 32, 
                    height: 32, 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#1D2A44', 
                    border: `2px solid ${t.color}`,
                    fontSize: '18px'
                  }}>
                    {t.icon}
                  </div>

                  {/* Character level badge */}
                  <div className="font-pixel" style={{ 
                    position: 'absolute', 
                    bottom: 12, 
                    left: 12, 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '7px',
                    background: '#1D2A44', 
                    color: t.color, 
                    border: `1.5px solid ${t.color}` 
                  }}>
                    {t.exp.toUpperCase()}
                  </div>
                </div>

                {/* Character Attributes Sheet */}
                <div style={{ padding: 20 }}>
                  <h3 className="font-arcade" style={{ fontWeight: 700, fontSize: '18px', color: '#1D2A44', margin: '0 0 4px 0' }}>{t.name}</h3>
                  <p className="font-pixel" style={{ fontSize: '8px', color: t.color, margin: '0 0 12px 0', letterSpacing: '0.5px' }}>{t.role.toUpperCase()}</p>
                  
                  {/* Achievement Emblem */}
                  <div style={{ 
                    fontSize: '11px', 
                    padding: '6px 10px', 
                    borderRadius: '8px', 
                    background: 'rgba(29, 42, 68, 0.05)', 
                    color: '#5D6D7E', 
                    border: '2px dashed #1D2A44',
                    marginBottom: 16,
                    display: 'inline-block'
                  }}>
                    🏆 {t.award}
                  </div>

                  {/* Attribute stats progress bars */}
                  <div style={{ spaceY: '6px', marginBottom: 16 }}>
                    {Object.entries(t.skills).map(([skill, val]) => (
                      <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className="font-pixel" style={{ fontSize: '6px', width: '38px', color: '#1D2A44' }}>{skill}</span>
                        <div className="pixel-progress" style={{ height: '7px', flexGrow: 1, border: '1.5px solid #1D2A44', background: 'rgba(0,0,0,0.05)' }}>
                          <div className="pixel-progress-fill" style={{ width: `${val}%`, background: t.color, borderRight: 'none' }} />
                        </div>
                        <span className="font-pixel" style={{ fontSize: '6px', width: '18px', textAlign: 'right' }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Character Social / Apprentice footer */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    paddingTop: 12, 
                    borderTop: '2px dashed rgba(29, 42, 68, 0.15)' 
                  }}>
                    <span className="font-arcade" style={{ fontSize: '11px', fontWeight: 'bold', color: '#5D6D7E' }}>
                      👤 {t.students}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[RiInstagramLine, RiYoutubeLine].map((Icon, j) => (
                        <a 
                          key={j} 
                          href="#"
                          className="arcade-btn"
                          style={{ 
                            width: 26, 
                            height: 26, 
                            borderRadius: '6px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: '#EEDDC2', 
                            color: '#1D2A44', 
                            textDecoration: 'none',
                            padding: 0,
                            boxShadow: '1.5px 1.5px 0px #1D2A44'
                          }}
                        >
                          <Icon size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Guild CTA */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button className="arcade-btn btn-outline" style={{ borderRadius: '12px', fontSize: '13px' }}>
              <RiCompassDiscoverLine size={16} /> VIEW ALL GUILD MASTERS [X]
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Teachers
