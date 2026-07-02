import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { RiDoubleQuotesL, RiStarFill } from 'react-icons/ri'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Parent',
    course: 'Bharatanatyam',
    quote: 'GSM Academy has transformed my daughter\'s talent and values beautifully. A perfect blend of culture and education.',
    rating: 5,
    initials: 'PS',
    color: 'var(--gold)',
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    role: 'Student',
    course: 'Tabla',
    quote: 'The teaching experience here is beyond comparison. It\'s a family of culture, respect and traditional learning.',
    rating: 5,
    initials: 'AM',
    color: '#a8d4c9',
  },
  {
    id: 3,
    name: 'Dr. Asha Nair',
    role: 'Community Member',
    course: 'Sanskrit',
    quote: 'Excellent platform for students to learn, practice and grow with Indian traditions. Highly recommended!',
    rating: 5,
    initials: 'AN',
    color: '#d4a8c9',
  },
]

const Testimonials = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="testimonials" ref={ref} style={{ padding: '96px 0', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, var(--cream), #f0e8d0)' }}>

      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center"
          style={{ marginBottom: 56 }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="ornamental-border" style={{ fontSize: 11, letterSpacing: '0.12em', fontWeight: 600, color: 'var(--gold)', marginBottom: 12 }}>
            VOICES OF OUR COMMUNITY
          </p>
          <h2 className="font-cormorant section-heading">
            What Our Community Says
          </h2>
          <div className="section-divider" style={{ margin: '12px auto 16px' }} />
        </motion.div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginBottom: 64 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="glass-card hover-lift card-hover"
              style={{ position: 'relative', padding: 28, borderRadius: 24 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Quote Icon */}
              <RiDoubleQuotesL size={36} style={{ marginBottom: 16, opacity: 0.4, color: 'var(--gold)' }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <RiStarFill key={j} size={14} style={{ color: 'var(--gold)' }} />
                ))}
              </div>

              <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic', color: 'var(--text-muted)' }}>
                "{t.quote}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(201,168,76,0.15)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'white', background: `linear-gradient(135deg, var(--deep-green), ${t.color})` }}>
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--deep-green)' }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--gold)' }}>{t.role} · {t.course}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ borderRadius: 28, overflow: 'hidden', background: 'linear-gradient(135deg, var(--deep-green), #2d5940)' }}
        >
          <div style={{ padding: '40px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.12em', fontWeight: 600, color: 'var(--gold)', marginBottom: 12 }}>BEGIN YOUR JOURNEY</p>
              <h3 className="font-cormorant" style={{ fontWeight: 700, fontSize: '2.5rem', color: 'white', marginBottom: 16 }}>
                Visit Our Campus
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.7)' }}>
                Experience our heritage campus, meet our teachers and explore your artistic potential in person.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <motion.button
                className="btn-primary"
                style={{ width: '100%', padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <i className="ri-map-pin-line" />
                Book a Visit
              </motion.button>
              <motion.button
                className="btn-outline"
                style={{ width: '100%', padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderColor: 'rgba(201,168,76,0.5)' }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <i className="ri-laptop-line" />
                Enroll Online
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
