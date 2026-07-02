import React, { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { RiArrowRightLine, RiArrowLeftLine, RiTimeLine, RiGroupLine, RiStarLine, RiBookOpenLine } from 'react-icons/ri'
import axios from 'axios'

const API_BASE = 'http://localhost:7070'
const ITEMS_PER_PAGE = 8

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } })
}

const Courses = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [courseRes, catRes] = await Promise.all([
          axios.get(`${API_BASE}/admin/public/courses`),
          axios.get(`${API_BASE}/admin/public/categories`)
        ])
        setCourses(courseRes.data.courses || [])
        setCategories(catRes.data.categories || [])
      } catch (err) {
        console.error('Failed to fetch courses:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter by category
  const filtered = activeCategory === 'All'
    ? courses
    : courses.filter(c => c.category === activeCategory)

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setCurrentPage(1)
  }

  const allCategories = [{ name: 'All', color: '#c9a84c' }, ...categories]

  return (
    <section id="courses" ref={ref}
      style={{ padding: '96px 0', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,var(--cream) 0%,#f0e8d0 100%)' }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,var(--gold),transparent)', opacity: 0.04, transform: 'translate(-30%,30%)', pointerEvents: 'none' }} />

      <div className="container">
        {/* Header */}
        <motion.div className="text-center" style={{ marginBottom: 48 }}
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp}>
          <p className="ornamental-border" style={{ fontSize: 11, letterSpacing: '0.12em', fontWeight: 600, color: 'var(--gold)', marginBottom: 12 }}>WHAT WE TEACH</p>
          <h2 className="font-cormorant section-heading">Featured Courses</h2>
          <div className="section-divider" style={{ margin: '12px auto 20px' }} />
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Explore our curated courses in classical arts, music, and cultural studies — crafted by masters, delivered with love.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 48 }}>
          {allCategories.map(cat => {
            const isActive = activeCategory === cat.name
            return (
              <motion.button key={cat.name} onClick={() => handleCategoryChange(cat.name)}
                style={{
                  padding: '8px 20px', borderRadius: 999, fontSize: 13, fontWeight: isActive ? 700 : 500, cursor: 'pointer',
                  background: isActive ? `linear-gradient(135deg,${cat.color}cc,${cat.color})` : 'rgba(26,58,42,0.06)',
                  color: isActive ? '#1a3a2a' : 'var(--text-muted)',
                  border: `1px solid ${isActive ? cat.color : 'rgba(201,168,76,0.2)'}`,
                  transition: 'all 0.25s'
                }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                {cat.name}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📚</div>
            <p>Loading courses...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <RiBookOpenLine size={48} style={{ margin: '0 auto 16px', opacity: 0.3, display: 'block' }} />
            <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--deep-green)' }}>No courses found</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>
              {activeCategory !== 'All' ? `No courses under "${activeCategory}" yet.` : 'No courses have been added yet.'}
            </p>
          </motion.div>
        )}

        {/* Course Grid */}
        {!loading && paginated.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24, marginBottom: 40 }}>
              {paginated.map((course, i) => (
                <motion.div key={course._id} custom={i}
                  initial="hidden" animate="visible" variants={fadeUp}
                  className="glass-card card-hover hover-lift"
                  style={{ borderRadius: 20, overflow: 'hidden', cursor: 'pointer' }}
                  whileHover={{ scale: 1.03 }}>

                  {/* Card Top — Thumbnail or Placeholder */}
                  <div style={{ position: 'relative', height: 168, overflow: 'hidden', background: 'linear-gradient(135deg,var(--deep-green),var(--deep-green-light))' }}>
                    {course.thumbnail ? (
                      <img
                        src={`${API_BASE}${course.thumbnail}`}
                        alt={course.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'absolute', width: 128, height: 128, borderRadius: '50%', border: '2px solid var(--gold)', opacity: 0.12 }} />
                        <div style={{ position: 'relative', zIndex: 2, width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
                          <RiBookOpenLine size={28} color="var(--gold)" />
                        </div>
                      </div>
                    )}
                    {course.category && (
                      <div style={{ position: 'absolute', top: 10, right: 10, padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: 'rgba(0,0,0,0.6)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.4)', backdropFilter: 'blur(8px)' }}>
                        {course.category}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: 18 }}>
                    <h3 className="font-cormorant" style={{ fontWeight: 700, fontSize: 20, color: 'var(--deep-green)', marginBottom: 6 }}>{course.title}</h3>
                    <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: 14 }}>
                      {course.description?.substring(0, 90)}{course.description?.length > 90 ? '...' : ''}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(201,168,76,0.15)' }}>
                      {course.assignedTeacher && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <RiGroupLine size={12} style={{ color: 'var(--gold)' }} />
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{course.assignedTeacher}</span>
                        </div>
                      )}
                      {course.department && (
                        <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 8px', borderRadius: 999, background: 'rgba(201,168,76,0.1)', color: 'var(--gold-dark)' }}>
                          {course.department}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.4 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <motion.button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(26,58,42,0.06)',
                color: 'var(--deep-green)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              whileHover={currentPage > 1 ? { scale: 1.1 } : {}}
              whileTap={currentPage > 1 ? { scale: 0.95 } : {}}>
              <RiArrowLeftLine />
            </motion.button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <motion.button key={i} onClick={() => setCurrentPage(i + 1)}
                style={{
                  width: 40, height: 40, borderRadius: '50%', fontSize: 14, fontWeight: currentPage === i + 1 ? 700 : 500,
                  border: `1px solid ${currentPage === i + 1 ? 'var(--gold)' : 'rgba(201,168,76,0.3)'}`,
                  background: currentPage === i + 1 ? 'linear-gradient(135deg,var(--gold-dark),var(--gold))' : 'rgba(26,58,42,0.06)',
                  color: currentPage === i + 1 ? 'var(--deep-green)' : 'var(--text-muted)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                {i + 1}
              </motion.button>
            ))}

            <motion.button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(26,58,42,0.06)',
                color: 'var(--deep-green)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              whileHover={currentPage < totalPages ? { scale: 1.1 } : {}}
              whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}>
              <RiArrowRightLine />
            </motion.button>
          </motion.div>
        )}

        {/* Total count */}
        {!loading && filtered.length > 0 && (
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
            Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} courses
          </p>
        )}
      </div>
    </section>
  )
}

export default Courses
