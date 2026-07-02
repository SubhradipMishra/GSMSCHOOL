import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: '25+', label: 'Years of Excellence', icon: 'ri-history-line' },
  { value: '10K+', label: 'Students Trained', icon: 'ri-group-line' },
  { value: '50+', label: 'Expert Teachers', icon: 'ri-user-star-line' },
  { value: '12+', label: 'Art Forms', icon: 'ri-palette-line' },
  { value: '200+', label: 'Events Hosted', icon: 'ri-calendar-event-line' },
  { value: '98%', label: 'Satisfaction Rate', icon: 'ri-heart-line' },
]

const ticker = [
  '✦ Bharatanatyam',
  '✦ Kathak',
  '✦ Tabla',
  '✦ Vocal Music',
  '✦ Flute',
  '✦ Painting',
  '✦ Sanskrit',
  '✦ Chess',
  '✦ Veena',
  '✦ Mridangam',
  '✦ Odissi',
  '✦ Manipuri',
]

const StatsBanner = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <>
      {/* Scrolling Ticker */}
      <div style={{ overflow: 'hidden', padding: '16px 0', position: 'relative', background: 'linear-gradient(135deg, var(--deep-green), var(--deep-green-light))', borderTop: '1px solid rgba(201,168,76,0.2)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
        <motion.div
          style={{ display: 'flex', gap: 32, whiteSpace: 'nowrap' }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          {[...ticker, ...ticker].map((item, i) => (
            <span
              key={i}
              style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.05em', flexShrink: 0, color: i % 3 === 0 ? 'var(--gold)' : 'rgba(255,255,255,0.7)' }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Stats Cards */}
      <section id="stats" ref={ref} style={{ padding: '64px 0', position: 'relative', overflow: 'hidden', background: 'var(--cream)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }} className="stats-grid">
            <style>{`.stats-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; } @media(max-width:1024px){.stats-grid{grid-template-columns:repeat(3,1fr);}} @media(max-width:768px){.stats-grid{grid-template-columns:repeat(2,1fr);}}`}</style>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                className="glass-card hover-lift card-hover"
                style={{ borderRadius: 16, padding: 20, textAlign: 'center' }}
                whileHover={{ scale: 1.06 }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', background: 'linear-gradient(135deg, var(--deep-green), var(--deep-green-light))', border: '1px solid var(--border-gold)' }}>
                  <i className={`${s.icon}`} style={{ fontSize: 18, color: 'var(--gold)' }} />
                </div>
                <motion.p
                  className="font-cormorant"
                  style={{ fontWeight: 700, fontSize: 30, color: 'var(--deep-green)' }}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  {s.value}
                </motion.p>
                <p style={{ fontSize: 12, marginTop: 4, lineHeight: 1.2, color: 'var(--text-muted)' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default StatsBanner
