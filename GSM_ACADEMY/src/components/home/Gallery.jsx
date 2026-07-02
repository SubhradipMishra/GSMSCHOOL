import React, { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { RiExpandDiagonalLine } from 'react-icons/ri'

const galleryImages = [
  { id: 1, label: 'Bharatanatyam Performance', category: 'Dance', cols: 2, rows: 2, bg: 'linear-gradient(135deg, #1a3a2a, #2d5940)', icon: 'ri-dance-line', color: '#c9a84c' },
  { id: 2, label: 'Kathak Evening', category: 'Dance', cols: 1, rows: 1, bg: 'linear-gradient(135deg, #2d2010, #5a3d1a)', icon: 'ri-body-scan-line', color: '#e8c96d' },
  { id: 3, label: 'Tabla Recital', category: 'Music', cols: 1, rows: 1, bg: 'linear-gradient(135deg, #1a2a3a, #2a4060)', icon: 'ri-rhythm-line', color: '#a8d4c9' },
  { id: 4, label: 'Cultural Festival', category: 'Events', cols: 1, rows: 2, bg: 'linear-gradient(135deg, #3a1a2a, #60304a)', icon: 'ri-sparkling-line', color: '#d4a8c9' },
  { id: 5, label: 'Vocal Concert', category: 'Music', cols: 1, rows: 1, bg: 'linear-gradient(135deg, #1a3a1a, #305030)', icon: 'ri-mic-line', color: '#a8d4a8' },
  { id: 6, label: 'Temple Architecture', category: 'Heritage', cols: 1, rows: 1, bg: 'linear-gradient(135deg, #3a2a1a, #604020)', icon: 'ri-ancient-pavilion-line', color: '#d4c4a8' },
  { id: 7, label: 'Sanskrit Class', category: 'Education', cols: 1, rows: 1, bg: 'linear-gradient(135deg, #1a1a3a, #2a2a60)', icon: 'ri-book-2-line', color: '#a8a8d4' },
  { id: 8, label: 'Annual Day Celebration', category: 'Events', cols: 2, rows: 1, bg: 'linear-gradient(135deg, #2a1a1a, #502a2a)', icon: 'ri-award-line', color: '#d4a8a8' },
]

const categories = ['All', 'Dance', 'Music', 'Events', 'Heritage', 'Education']

const Gallery = () => {
  const [filter, setFilter] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const filtered = filter === 'All' ? galleryImages : galleryImages.filter(g => g.category === filter)

  return (
    <section id="gallery" ref={ref} style={{ padding: '96px 0', position: 'relative', overflow: 'hidden', background: 'var(--cream)' }}>

      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center"
          style={{ marginBottom: 48 }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="ornamental-border" style={{ fontSize: 11, letterSpacing: '0.12em', fontWeight: 600, color: 'var(--gold)', marginBottom: 12 }}>
            VISUAL STORIES
          </p>
          <h2 className="font-cormorant section-heading">
            Gallery Showcase
          </h2>
          <div className="section-divider" style={{ margin: '12px auto 20px' }} />
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Glimpses of our vibrant cultural performances, classes, and celebrations throughout the years.
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 40 }}
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '6px 16px', borderRadius: 999, fontSize: 14, fontWeight: filter === cat ? 700 : 500, transition: 'all 0.2s', cursor: 'pointer',
                background: filter === cat ? 'linear-gradient(135deg, var(--gold-dark), var(--gold))' : 'rgba(26,58,42,0.06)',
                color: filter === cat ? 'var(--deep-green)' : 'var(--text-muted)',
                border: `1px solid ${filter === cat ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <div className="masonry">
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="masonry-item card-hover hover-lift"
              style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', cursor: 'pointer', height: img.rows > 1 ? 320 : 180, display: 'block' }}
              onClick={() => setLightbox(img)}
            >
              {/* Image placeholder */}
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: img.bg }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(201,168,76,0.1), transparent)' }} />
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <i className={`${img.icon}`} style={{ fontSize: 32, color: img.color }} />
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 500, padding: '0 12px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                    {img.label}
                  </p>
                </div>
              </div>

              {/* Overlay on hover */}
              <div className="gallery-overlay" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: 16, opacity: 0, transition: 'opacity 0.3s', background: 'linear-gradient(0deg, rgba(0,0,0,0.7), transparent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div>
                    <p style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{img.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--gold)' }}>{img.category}</p>
                  </div>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.2)', border: '1px solid var(--gold)' }}>
                    <RiExpandDiagonalLine size={14} style={{ color: 'var(--gold)' }} />
                  </div>
                </div>
              </div>
              <style>{`.masonry-item:hover .gallery-overlay { opacity: 1 !important; }`}</style>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{ position: 'relative', maxWidth: 672, width: '100%', borderRadius: 24, overflow: 'hidden', background: lightbox.bg, minHeight: 400, border: '1px solid rgba(201,168,76,0.3)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 96, height: 96, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', background: 'rgba(255,255,255,0.1)' }}>
                    <i className={`${lightbox.icon}`} style={{ fontSize: 48, color: lightbox.color }} />
                  </div>
                  <p className="font-cormorant" style={{ color: 'white', fontSize: 24, fontWeight: 600 }}>{lightbox.label}</p>
                  <p style={{ fontSize: 14, marginTop: 4, color: 'var(--gold)' }}>{lightbox.category}</p>
                </div>
              </div>
              <div style={{ padding: 24, borderTop: '1px solid rgba(201,168,76,0.2)' }}>
                <p className="font-cormorant" style={{ color: 'white', fontWeight: 600, fontSize: 20 }}>{lightbox.label}</p>
                <p style={{ fontSize: 14, marginTop: 4, color: 'rgba(255,255,255,0.6)' }}>GSM Academy Cultural Archive</p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 18, border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Gallery
