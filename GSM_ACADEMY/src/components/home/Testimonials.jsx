import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { RiDoubleQuotesL, RiStarFill, RiMapPinLine } from 'react-icons/ri'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Parent Guild',
    course: 'Bharatanatyam',
    quote: 'GSM Academy has transformed my daughter\'s talent and values beautifully. A perfect blend of culture and education.',
    rating: 5,
    initials: 'PS',
    color: '#FF6F3C',
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    role: 'Student Class',
    course: 'Tabla Quest',
    quote: 'The teaching experience here is beyond comparison. It\'s a family of culture, respect and traditional learning.',
    rating: 5,
    initials: 'AM',
    color: '#2ECC71',
  },
  {
    id: 3,
    name: 'Dr. Asha Nair',
    role: 'Guild Council',
    course: 'Sanskrit Quest',
    quote: 'Excellent platform for students to learn, practice and grow with Indian traditions. Highly recommended!',
    rating: 5,
    initials: 'AN',
    color: '#3498DB',
  },
]

const Testimonials = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <>
      {/* Level 8 Connector */}
      <div className="level-connector">
        <div className="level-flag">LEVEL 8: PLAYER LOGS & CONTINUE SCREEN</div>
      </div>

      <section id="testimonials" ref={ref} style={{ padding: '96px 0', position: 'relative', overflow: 'hidden', background: '#FDF6E3' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="font-pixel" style={{ fontSize: '9px', color: '#FF6F3C', margin: '0 0 12px 0' }}>PARTY DIALOGS</p>
            <h2 className="font-arcade" style={{ fontSize: '32px', color: '#1D2A44', margin: '0 0 16px 0' }}>WHAT PLAYERS SAY</h2>
          </div>

          {/* Zelda Dialogue Speech Bubbles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginBottom: 64 }} className="testimonials-grid">
            <style>{`
              @media(max-width: 1024px) {
                .testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
              }
              @media(max-width: 768px) {
                .testimonials-grid { grid-template-columns: 1fr !important; }
              }
            `}</style>
            
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="arcade-card"
                style={{ 
                  padding: 28, 
                  borderRadius: 24,
                  background: '#FDF6E3',
                  boxShadow: '4px 4px 0px #1D2A44'
                }}
                whileHover={{ scale: 1.03, translateY: -2 }}
              >
                {/* Speech double quote icon & pixel stars */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <RiDoubleQuotesL size={32} style={{ color: '#FF6F3C', opacity: 0.8 }} />
                  
                  {/* Rating Stars */}
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <RiStarFill key={j} size={14} style={{ color: '#F5B041' }} />
                    ))}
                  </div>
                </div>

                {/* Testimonial Quote */}
                <p style={{ 
                  fontSize: '13.5px', 
                  lineHeight: 1.6, 
                  marginBottom: 24, 
                  fontStyle: 'italic', 
                  color: '#5D6D7E', 
                  minHeight: '70px'
                }}>
                  "{t.quote}"
                </p>

                {/* Author Info */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  paddingTop: 16, 
                  borderTop: '2px dashed rgba(29, 42, 68, 0.15)' 
                }}>
                  {/* Pixel Face Avatar box */}
                  <div style={{ 
                    width: 42, 
                    height: 42, 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 'bold', 
                    fontSize: '14px', 
                    color: '#FDF6E3', 
                    background: '#1D2A44',
                    border: `2px solid ${t.color}`,
                    boxShadow: '1.5px 1.5px 0px #1D2A44'
                  }} className="font-arcade">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-arcade" style={{ fontWeight: 'bold', fontSize: '13px', color: '#1D2A44', margin: 0 }}>
                      {t.name}
                    </p>
                    <p className="font-pixel" style={{ fontSize: '7px', color: '#FF6F3C', margin: '2px 0 0 0' }}>
                      {t.role.toUpperCase()} · {t.course.toUpperCase()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Continue Expedition / HQ Visit Banner */}
          <motion.div
            className="arcade-card-dark crt-screen"
            style={{ 
              borderRadius: '28px',
              border: '4px solid #1D2A44',
              boxShadow: '8px 8px 0px #1D2A44',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '48px 56px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 32, alignItems: 'center' }} className="testimonials-banner-grid">
              <style>{`
                @media(max-width: 900px) {
                  .testimonials-banner-grid { grid-template-columns: 1fr !important; gap: 32px !important; padding: 32px !important; }
                }
              `}</style>
              
              <div>
                <p className="font-pixel" style={{ fontSize: '8px', color: '#F5B041', marginBottom: 12 }}>CONTINUE CAMPAIGN?</p>
                <h3 className="font-arcade" style={{ fontWeight: 700, fontSize: '28px', color: '#FDF6E3', marginBottom: 16 }}>
                  VISIT GUILD CAMPS
                </h3>
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#CCD1D1', margin: 0 }}>
                  Expedition map locations are open. Book a walk-in visit to our physical academy headquarters, interact with masters, and view physical trophy items.
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <button
                  className="arcade-btn btn-secondary"
                  style={{ width: '100%', padding: '12px 0', borderRadius: 12, fontSize: '13px' }}
                >
                  <RiMapPinLine size={16} />
                  BOOK VISIT [HQ]
                </button>
                <button
                  className="arcade-btn btn-outline"
                  style={{ width: '100%', padding: '12px 0', borderRadius: 12, fontSize: '13px', color: '#FDF6E3', borderColor: 'rgba(253, 246, 227, 0.4)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <i className="ri-laptop-line" />
                  ENROLL ONLINE
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Testimonials
