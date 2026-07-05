import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { RiExpandDiagonalLine, RiFileList3Line } from 'react-icons/ri'

const galleryImages = [
  { id: 1, label: 'Bharatanatyam Recital', category: 'Dance', cols: 2, rows: 2, bg: 'linear-gradient(135deg, #1D2A44, #2E4057)', icon: '💃', color: '#FF6F3C', xp: '+500 XP' },
  { id: 2, label: 'Kathak Evening', category: 'Dance', cols: 1, rows: 1, bg: 'linear-gradient(135deg, #2D1E10, #4A321A)', icon: '✨', color: '#F5B041', xp: '+250 XP' },
  { id: 3, label: 'Tabla Solo Quest', category: 'Music', cols: 1, rows: 1, bg: 'linear-gradient(135deg, #1A3A35, #2D5E56)', icon: '🥁', color: '#2ECC71', xp: '+250 XP' },
  { id: 4, label: 'Cultural Carnival', category: 'Events', cols: 1, rows: 2, bg: 'linear-gradient(135deg, #3A1A2A, #5A2A42)', icon: '🎪', color: '#E74C3C', xp: '+400 XP' },
  { id: 5, label: 'Vocal Concert', category: 'Music', cols: 1, rows: 1, bg: 'linear-gradient(135deg, #1C2833, #34495E)', icon: '🎼', color: '#3498DB', xp: '+300 XP' },
  { id: 6, label: 'Temple Heritage', category: 'Heritage', cols: 1, rows: 1, bg: 'linear-gradient(135deg, #5D4037, #8D6E63)', icon: '🏛️', color: '#EEDDC2', xp: '+150 XP' },
  { id: 7, label: 'Sanskrit Quest', category: 'Education', cols: 1, rows: 1, bg: 'linear-gradient(135deg, #1B263B, #415A77)', icon: '📜', color: '#A9DFBF', xp: '+200 XP' },
  { id: 8, label: 'Annual Ceremony', category: 'Events', cols: 2, rows: 1, bg: 'linear-gradient(135deg, #4A235A, #6C3483)', icon: '🏆', color: '#F7DC6F', xp: '+600 XP' },
]

const categories = ['All', 'Dance', 'Music', 'Events', 'Heritage', 'Education']

const Gallery = () => {
  const [filter, setFilter] = useState('All')
  const [lightbox, setLightbox] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const filtered = filter === 'All' ? galleryImages : galleryImages.filter(g => g.category === filter)

  return (
    <>
      {/* Level 7 Connector */}
      <div className="level-connector">
        <div className="level-flag">LEVEL 7: THE ARCHIVE TROPHY ROOM</div>
      </div>

      <section id="gallery" ref={ref} style={{ padding: '96px 0', position: 'relative', overflow: 'hidden', background: '#FDF6E3' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="font-pixel" style={{ fontSize: '9px', color: '#FF6F3C', margin: '0 0 12px 0' }}>THE TROPHY ROOM</p>
            <h2 className="font-arcade" style={{ fontSize: '32px', color: '#1D2A44', margin: '0 0 16px 0' }}>SNAPSHOT ARCHIVES</h2>
            <p style={{ color: '#5D6D7E', fontSize: '15px', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
              Unlock the visual chronicle logs of our community’s legendary performances, temple heritage trips, and certification days.
            </p>
          </div>

          {/* Retro Filters (Game Selection buttons) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 40 }}>
            {categories.map(cat => {
              const isCurrent = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="font-arcade"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    background: isCurrent ? '#1D2A44' : '#FDF6E3',
                    color: isCurrent ? '#FDF6E3' : '#1D2A44',
                    border: '3px solid #1D2A44',
                    boxShadow: isCurrent ? 'none' : '3px 3px 0px #1D2A44',
                    transform: isCurrent ? 'translate(2px, 2px)' : 'none',
                    transition: 'all 0.1s ease'
                  }}
                >
                  {cat.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Masonry CRT Grid */}
          <div className="masonry">
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="masonry-item arcade-card"
                style={{
                  height: img.rows > 1 ? 320 : 180,
                  display: 'block',
                  cursor: 'pointer',
                  marginRight: 0,
                  marginLeft: 0,
                  marginBottom: 20
                }}
                onClick={() => setLightbox(img)}
              >
                {/* CRT screen content representation */}
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: img.bg, position: 'relative' }} className="crt-screen">
                  {/* Outer scan line shadow inside card */}
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 100%)', zIndex: 1 }} />
                  
                  {/* CRT Screen center details */}
                  <div style={{ relative: true, zIndex: 2, textAlign: 'center', padding: 12 }}>
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: '12px',
                      background: 'rgba(253, 246, 227, 0.1)',
                      border: '2px solid rgba(253, 246, 227, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      margin: '0 auto 10px'
                    }}>
                      {img.icon}
                    </div>
                    <p className="font-arcade" style={{ fontSize: '11px', fontWeight: 'bold', color: '#FDF6E3', margin: 0 }}>
                      {img.label}
                    </p>
                    <span className="font-pixel" style={{ fontSize: '7px', color: '#F5B041', marginTop: 4, display: 'inline-block' }}>
                      {img.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Retro hovering card display overlay */}
                  <div className="gallery-overlay" style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 16,
                    background: 'rgba(29, 42, 68, 0.9)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease-in-out'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="font-pixel" style={{ fontSize: '7px', color: '#FF6F3C' }}>STAGE_CLEAR</span>
                      <span className="font-pixel" style={{ fontSize: '8px', color: '#2ECC71' }}>{img.xp}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p className="font-arcade" style={{ fontSize: '12px', color: '#FDF6E3', fontWeight: 'bold', margin: 0 }}>{img.label}</p>
                        <p className="font-pixel" style={{ fontSize: '6px', color: '#F5B041', margin: '2px 0 0 0' }}>{img.category.toUpperCase()}</p>
                      </div>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '6px',
                        background: '#FF6F3C',
                        border: '2px solid #1D2A44',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FDF6E3'
                      }}>
                        <RiExpandDiagonalLine size={12} />
                      </div>
                    </div>
                  </div>
                  <style>{`.masonry-item:hover .gallery-overlay { opacity: 1 !important; }`}</style>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vintage Monitor Lightbox Modal */}
        <AnimatePresence>
          {lightbox && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1050,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(8px)'
              }}
              onClick={() => setLightbox(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="arcade-card crt-screen"
                style={{
                  maxWidth: '600px',
                  width: '100%',
                  background: '#1D2A44',
                  border: '5px solid #1D2A44',
                  boxShadow: '10px 10px 0px #FF6F3C',
                  padding: 0
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setLightbox(null)}
                  className="font-pixel"
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 30,
                    height: 30,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#FF6F3C',
                    color: '#FDF6E3',
                    border: '2px solid #1D2A44',
                    fontSize: '11px',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                >
                  ✕
                </button>

                {/* CRT Screen inside Lightbox */}
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: lightbox.bg, relative: true }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />
                  <div style={{ relative: true, zIndex: 2, textAlign: 'center' }}>
                    <div style={{
                      width: 80,
                      height: 80,
                      borderRadius: '16px',
                      background: 'rgba(253, 246, 227, 0.1)',
                      border: '3px solid rgba(253, 246, 227, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '36px',
                      margin: '0 auto 16px'
                    }} className="float-effect">
                      {lightbox.icon}
                    </div>
                    <h3 className="font-arcade" style={{ color: '#FDF6E3', fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
                      {lightbox.label}
                    </h3>
                    <p className="font-pixel" style={{ color: '#F5B041', fontSize: '8px', marginTop: 8, margin: 0 }}>
                      CATEGORY: {lightbox.category.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Lightbox details panel */}
                <div style={{ padding: '24px', background: '#FDF6E3', borderTop: '4px solid #1D2A44', color: '#1D2A44' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h4 className="font-arcade" style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                      GSM Cultural Archive Entry
                    </h4>
                    <span className="font-pixel" style={{ fontSize: '8px', color: '#FF6F3C', background: '#1D2A44', padding: '3px 8px', borderRadius: '4px' }}>
                      {lightbox.xp}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#5D6D7E', margin: 0, lineHeight: 1.5 }}>
                    Recorded during official events in India's cultural heritage programs at GSM Academy campuses.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}

export default Gallery
