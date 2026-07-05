import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { RiArrowRightLine } from 'react-icons/ri'

const timeline = [
  { year: '1998', title: 'World 1: Spawn', desc: 'GSM Academy founded to preserve classical Indian arts.' },
  { year: '2003', title: 'World 2: Guild House', desc: 'First campus opened with 200+ active players.' },
  { year: '2009', title: 'World 3: Renown', desc: 'State Award for cultural education excellence.' },
  { year: '2013', title: 'World 4: Alliance', desc: 'Community expanded to 5,000+ cultural families.' },
  { year: '2018', title: 'World 5: Portal Shift', desc: 'Digital portal launched for global classes.' },
  { year: '2023', title: 'World 6: Ascension', desc: '25+ year legacy touching 10,000+ lives.' },
]

const pillars = [
  { icon: '🏛️', title: 'Cultural Heritage', desc: 'Rooted in 5,000 years of classical tradition and spiritual art legacy.', type: 'Relic' },
  { icon: '⭐', title: 'Expert Faculty', desc: 'Learn directly from award-winning gurus and guild masters.', type: 'Master' },
  { icon: '🌱', title: 'Holistic Growth', desc: 'Develop discipline, mind focus, and ethical character traits.', type: 'Buff' },
  { icon: '🌐', title: 'Digital Access', desc: 'Live quests and recorded learning scrolls accessible worldwide.', type: 'Spell' },
  { icon: '👥', title: 'Guild Community', desc: '10,000+ alumni and family members in a shared cultural world.', type: 'Alliance' },
  { icon: '📜', title: 'Certified Paths', desc: 'Govt. certified certifications with vocational career pathways.', type: 'Reward' },
]

const features = [
  { icon: '🎮', label: 'Student Dashboard' },
  { icon: '🧙‍♂️', label: 'Teacher Portal' },
  { icon: '📅', label: 'Quest Events' },
  { icon: '🪙', label: 'Secure Checkout' },
  { icon: '📊', label: 'XP & Analytics' },
  { icon: '📜', label: 'Certificate Room' },
  { icon: '📍', label: 'Attendance Check' },
  { icon: '⚙️', label: 'Admin Command' },
]

const About = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [selectedTimelineNode, setSelectedTimelineNode] = useState(timeline.length - 1)

  return (
    <>
      {/* Level 3 Connector */}
      <div className="level-connector">
        <div className="level-flag">LEVEL 3: STORY & PILLARS</div>
      </div>

      <section id="about" ref={ref} style={{ padding: '96px 0', position: 'relative', overflow: 'hidden', background: '#FDF6E3' }}>
        {/* Background Decorative Rings */}
        <div style={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, borderRadius: '50%', border: '4px dashed rgba(29, 42, 68, 0.05)', pointerEvents: 'none' }} />

        <div className="container">
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className="font-pixel" style={{ fontSize: '9px', color: '#FF6F3C', margin: '0 0 12px 0' }}>THE CHRONICLES</p>
            <h2 className="font-arcade" style={{ fontSize: '32px', color: '#1D2A44', margin: '0 0 16px 0' }}>LEGEND OF GSM ACADEMY</h2>
            <p style={{ color: '#5D6D7E', fontSize: '15px', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
              A 25+ year quest of passion, preserving traditional Indian heritage through modern interactive classrooms. Explore the story of our growth.
            </p>
          </div>

          {/* Snaking Mario World Timeline Map */}
          <div style={{ 
            background: 'rgba(238, 221, 194, 0.3)', 
            border: '3px solid #1D2A44',
            borderRadius: '24px',
            padding: '32px',
            position: 'relative',
            marginBottom: 80,
            boxShadow: '6px 6px 0px #1D2A44'
          }}>
            <p className="font-pixel" style={{ fontSize: '8px', color: '#FF6F3C', marginBottom: 24, textAlign: 'center' }}>
              SELECT STAGE LEVEL NODE TO VIEW CHRONICLE DATA
            </p>

            {/* Path Connection Line */}
            <div style={{ 
              position: 'absolute', 
              top: '55%', 
              left: '8%', 
              right: '8%', 
              height: '8px', 
              background: '#1D2A44', 
              border: '2px solid #FF6F3C',
              borderRadius: '4px',
              zIndex: 1,
              transform: 'translateY(-50%)'
            }} className="hidden md:block" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, position: 'relative', zIndex: 2 }} className="timeline-grid">
              <style>{`
                @media(max-width: 768px) {
                  .timeline-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
                }
              `}</style>
              
              {timeline.map((item, i) => {
                const isSelected = selectedTimelineNode === i;
                return (
                  <div key={item.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    {/* Level Castle/Node button */}
                    <motion.button
                      onClick={() => setSelectedTimelineNode(i)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        border: '4px solid #1D2A44',
                        background: isSelected ? '#FF6F3C' : '#EEDDC2',
                        color: isSelected ? '#FDF6E3' : '#1D2A44',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        boxShadow: isSelected ? 'none' : '3px 3px 0px #1D2A44',
                        transform: isSelected ? 'translate(2px, 2px)' : 'none',
                        transition: 'all 0.1s ease',
                        marginBottom: 12
                      }}
                      className="font-pixel"
                    >
                      {item.year}
                    </motion.button>
                    
                    <span className="font-arcade" style={{ fontSize: '11px', color: isSelected ? '#FF6F3C' : '#1D2A44', fontWeight: 'bold' }}>
                      {item.title.split(":")[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Stage Detail Panel (Interactive display) */}
            <div style={{ 
              marginTop: '32px', 
              background: '#1D2A44', 
              color: '#FDF6E3',
              padding: '20px 24px', 
              borderRadius: '16px',
              border: '3px solid #FF6F3C',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }} className="font-pixel">
                <span style={{ fontSize: '9px', color: '#F5B041' }}>
                  {timeline[selectedTimelineNode].title.toUpperCase()}
                </span>
                <span style={{ fontSize: '8px', color: '#2ECC71' }}>STATUS: COMPLETED ✓</span>
              </div>
              <h4 className="font-arcade" style={{ fontSize: '18px', color: '#FDF6E3', margin: '4px 0 8px 0', fontWeight: 'bold' }}>
                GSM Chronicle #{timeline[selectedTimelineNode].year}
              </h4>
              <p style={{ fontSize: '13px', color: '#CCD1D1', margin: 0, lineHeight: 1.6 }}>
                {timeline[selectedTimelineNode].desc}
              </p>
            </div>
          </div>

          {/* Pillars: RPG Player Inventory Grid */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p className="font-pixel" style={{ fontSize: '9px', color: '#FF6F3C', margin: '0 0 10px 0' }}>INVENTORY ITEMS</p>
            <h3 className="font-arcade" style={{ fontSize: '28px', color: '#1D2A44', margin: 0 }}>GURUS & ABILITIES</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 80 }} className="pillars-grid">
            <style>{`
              @media(max-width: 1024px) {
                .pillars-grid { grid-template-columns: repeat(2, 1fr) !important; }
              }
              @media(max-width: 768px) {
                .pillars-grid { grid-template-columns: 1fr !important; }
              }
            `}</style>
            
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                className="arcade-card"
                style={{ 
                  padding: '24px', 
                  borderRadius: '20px',
                  background: 'rgba(253, 246, 227, 0.9)',
                  boxShadow: '4px 4px 0px #1D2A44'
                }}
                whileHover={{ scale: 1.03, translateY: -2 }}
              >
                {/* Inventory Slot Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '10px', 
                    background: '#EEDDC2', 
                    border: '3px solid #1D2A44',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '2px 2px 0px #1D2A44'
                  }}>
                    {p.icon}
                  </div>
                  <span className="font-pixel" style={{ 
                    fontSize: '8px', 
                    color: '#FF6F3C',
                    background: '#1D2A44',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {p.type.toUpperCase()}
                  </span>
                </div>

                <h4 className="font-arcade" style={{ fontSize: '18px', color: '#1D2A44', margin: '0 0 8px 0', fontWeight: 'bold' }}>
                  {p.title}
                </h4>
                
                <p style={{ fontSize: '13px', color: '#5D6D7E', margin: 0, lineHeight: 1.6 }}>
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Platform Features Console Banner */}
          <motion.div 
            className="arcade-card-dark"
            style={{ 
              borderRadius: '28px',
              border: '4px solid #1D2A44',
              boxShadow: '8px 8px 0px #1D2A44',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '48px 32px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40, alignItems: 'center' }} className="features-grid">
              <style>{`
                @media(max-width: 900px) {
                  .features-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
                }
              `}</style>
              
              <div>
                <p className="font-pixel" style={{ fontSize: '8px', color: '#F5B041', marginBottom: 12 }}>SYSTEM STATS & MODULES</p>
                <h3 className="font-arcade" style={{ fontWeight: 700, fontSize: '24px', color: '#FDF6E3', marginBottom: 16, lineHeight: 1.3 }}>
                  DIGITAL INTERACTION PORTAL
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#CCD1D1', marginBottom: 28 }}>
                  Our academic engine runs on a gamified portal where students enroll, register for quest events, track attendance, and clear examinations to level up their certificates.
                </p>
                <a href="#courses" className="arcade-btn btn-secondary" style={{ textDecoration: 'none', borderRadius: '10px', fontSize: '12px' }}>
                  EXPLORE QUEST MODULES <RiArrowRightLine />
                </a>
              </div>

              {/* Grid of feature badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {features.map((f, i) => (
                  <motion.div 
                    key={f.label}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      padding: '10px 12px', 
                      borderRadius: '12px',
                      background: 'rgba(253, 246, 227, 0.1)', 
                      border: '2px solid rgba(253, 246, 227, 0.25)',
                    }}
                    whileHover={{ background: 'rgba(253, 246, 227, 0.15)', scale: 1.03 }}
                  >
                    <span style={{ fontSize: '18px' }}>{f.icon}</span>
                    <span className="font-arcade" style={{ fontSize: '11px', fontWeight: 'bold', color: '#FDF6E3' }}>{f.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default About
