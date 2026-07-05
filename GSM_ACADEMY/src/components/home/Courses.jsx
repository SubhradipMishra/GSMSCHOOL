import React, { useState, useRef, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiArrowRightLine, RiArrowLeftLine, RiTimeLine, RiGroupLine, RiBookOpenLine, RiFolderOpenLine } from 'react-icons/ri'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Context from '../../util/Context'

const API_BASE = 'http://localhost:7070'
const ITEMS_PER_PAGE = 8

const Courses = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [enrolledIds, setEnrolledIds] = useState([])

  const { session } = useContext(Context)
  const navigate = useNavigate()
  const ref = useRef(null)

  const fetchEnrollments = async () => {
    if (!session) return
    try {
      const res = await axios.get(`${API_BASE}/course-enrollment/my-courses`, { withCredentials: true })
      if (res.data.success) {
        const ids = res.data.enrollments.map(e => e.courseId?._id || e.courseId)
        setEnrolledIds(ids)
      }
    } catch (err) {
      console.error('Failed to fetch enrollments:', err)
    }
  }

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

  useEffect(() => {
    fetchEnrollments()
  }, [session])

  const handleBuyClick = async (course) => {
    if (!session) {
      navigate('/login')
      return
    }
    const finalPrice = Math.max(0, (course.price || 0) - (course.discount || 0))
    if (finalPrice === 0) {
      try {
        const res = await axios.post(`${API_BASE}/course-enrollment/enroll-free`, { courseId: course._id }, { withCredentials: true })
        if (res.data.success) {
          alert('Enrolled in free course successfully!')
          fetchEnrollments()
        }
      } catch (err) {
        console.error(err)
        alert('Failed to enroll in free course')
      }
    } else {
      navigate(`/courses/${course._id}/checkout`)
    }
  }

  // Filter courses by category
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

  const allCategories = [{ name: 'All', color: '#FF6F3C' }, ...categories]

  return (
    <>
      {/* Level 4 Connector */}
      <div className="level-connector">
        <div className="level-flag">LEVEL 4: SKILL TREE EXPLORER</div>
      </div>

      <section id="courses" ref={ref} style={{ padding: '96px 0', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #FDF6E3 0%, #EEDDC2 100%)' }}>
        {/* Decorative corner accent */}
        <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, borderRadius: '50%', border: '4px dashed rgba(29, 42, 68, 0.05)', pointerEvents: 'none' }} />

        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="font-pixel" style={{ fontSize: '9px', color: '#FF6F3C', margin: '0 0 12px 0' }}>SKILL TREE SELECTOR</p>
            <h2 className="font-arcade" style={{ fontSize: '32px', color: '#1D2A44', margin: '0 0 16px 0' }}>CHOOSE YOUR QUEST PATH</h2>
            <p style={{ color: '#5D6D7E', fontSize: '15px', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
              Select a category tab to filter. Unlock new heritage arts, master rhythm sequences, and earn certified ranks.
            </p>
          </div>

          {/* Category Filter Pills (Game Menu style tabs) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
            {allCategories.map(cat => {
              const isActive = activeCategory === cat.name
              return (
                <motion.button 
                  key={cat.name} 
                  onClick={() => handleCategoryChange(cat.name)}
                  className="font-arcade"
                  style={{
                    padding: '8px 20px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    background: isActive ? '#1D2A44' : '#FDF6E3',
                    color: isActive ? '#FDF6E3' : '#1D2A44',
                    border: '3px solid #1D2A44',
                    boxShadow: isActive ? 'none' : '3px 3px 0px #1D2A44',
                    transform: isActive ? 'translate(2px, 2px)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  whileHover={!isActive ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.97 }}
                >
                  {cat.name.toUpperCase()}
                </motion.button>
              )
            })}
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#1D2A44' }}>
              <div style={{ fontSize: '48px', marginBottom: 16 }} className="float-effect">🎮</div>
              <p className="font-pixel" style={{ fontSize: '10px', color: '#FF6F3C' }}>LOADING CAMPAIGNS...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', background: 'rgba(29, 42, 68, 0.04)', borderRadius: '24px', border: '3px dashed #1D2A44' }}>
              <RiFolderOpenLine size={48} style={{ margin: '0 auto 16px', color: '#FF6F3C' }} />
              <h3 className="font-arcade" style={{ fontSize: '20px', color: '#1D2A44', margin: 0 }}>NO QUESTS UNLOCKED</h3>
              <p style={{ fontSize: '14px', color: '#5D6D7E', marginTop: 8 }}>
                No active courses under "{activeCategory}" category are currently available. Check back soon!
              </p>
            </div>
          )}

          {/* Course Skill Tree Grid */}
          {!loading && paginated.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: 24, 
                  marginBottom: 48 
                }}
              >
                {paginated.map((course, i) => {
                  const finalPrice = Math.max(0, (course.price || 0) - (course.discount || 0));
                  const isEnrolled = enrolledIds.includes(course._id);
                  
                  return (
                    <div 
                      key={course._id}
                      className="arcade-card"
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'space-between',
                        background: '#FDF6E3'
                      }}
                      onClick={() => navigate(`/courses/${course._id}`)}
                    >
                      <div>
                        {/* Course Card Top Frame */}
                        <div style={{ 
                          position: 'relative', 
                          height: 168, 
                          overflow: 'hidden', 
                          background: '#1D2A44',
                          borderBottom: '3px solid #1D2A44'
                        }} className="crt-screen">
                          {course.thumbnail ? (
                            <img
                              src={`${API_BASE}${course.thumbnail}`}
                              alt={course.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <RiBookOpenLine size={36} color="#FDF6E3" />
                            </div>
                          )}
                          
                          {/* Pixel Badges */}
                          {course.category && (
                            <div className="font-pixel" style={{ 
                              position: 'absolute', 
                              top: 10, 
                              right: 10, 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '7px', 
                              background: '#1D2A44', 
                              color: '#F5B041', 
                              border: '1.5px solid #F5B041' 
                            }}>
                              {course.category.toUpperCase()}
                            </div>
                          )}
                          
                          {course.tag && (
                            <div className="font-pixel" style={{ 
                              position: 'absolute', 
                              top: 10, 
                              left: 10, 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '7px', 
                              background: '#FF6F3C', 
                              color: '#FDF6E3', 
                              border: '1.5px solid #1D2A44',
                              boxShadow: '2px 2px 0px #1D2A44'
                            }}>
                              {course.tag.toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Course Card Details */}
                        <div style={{ padding: 20 }}>
                          <h3 className="font-arcade" style={{ fontWeight: 700, fontSize: '18px', color: '#1D2A44', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                            {course.title}
                          </h3>
                          <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#5D6D7E', marginBottom: 16 }} className="line-clamp-2">
                            {course.description}
                          </p>

                          {/* Level Cost & Playtime */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '2px dashed rgba(29, 42, 68, 0.15)', marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span className="font-pixel" style={{ fontSize: '8px', color: '#FF6F3C' }}>COST:</span>
                              {finalPrice > 0 ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <span style={{ textDecoration: 'line-through', color: '#5D6D7E', fontSize: '10px' }}>₹{course.price}</span>
                                  <span className="font-arcade" style={{ fontWeight: 'bold', color: '#1D2A44', fontSize: '14px' }}>₹{finalPrice}</span>
                                </div>
                              ) : (
                                <span className="font-pixel" style={{ fontSize: '8px', color: '#2ECC71', background: 'rgba(46, 204, 113, 0.15)', padding: '2px 6px', borderRadius: '4px', border: '1.5px solid #2ECC71' }}>FREE QUEST</span>
                              )}
                            </div>
                            
                            {course.duration && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#5D6D7E', fontSize: '11px' }}>
                                <RiTimeLine size={13} style={{ color: '#F5B041' }} />
                                <span>{course.duration}</span>
                              </div>
                            )}
                          </div>

                          {/* Guru & Department Info */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                            {course.assignedTeacher && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#5D6D7E' }}>
                                <RiGroupLine size={13} style={{ color: '#FF6F3C' }} />
                                <span>{course.assignedTeacher}</span>
                              </div>
                            )}
                            {course.department && (
                              <span className="font-arcade" style={{ fontSize: '9px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px', background: 'rgba(29, 42, 68, 0.08)', color: '#1D2A44', border: '1.5px solid #1D2A44' }}>
                                {course.department.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ padding: '0 20px 20px 20px', display: 'flex', gap: 10 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/${course._id}`);
                          }}
                          className="arcade-btn btn-outline"
                          style={{ flex: 1, padding: '8px 0', fontSize: '11px', borderRadius: '10px' }}
                        >
                          INFO [Y]
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isEnrolled) {
                              navigate(`/student/dashboard`);
                            } else {
                              handleBuyClick(course);
                            }
                          }}
                          className="arcade-btn btn-primary"
                          style={{ flex: 1, padding: '8px 0', fontSize: '11px', borderRadius: '10px' }}
                        >
                          {isEnrolled ? 'ENROLLED ✓' : (finalPrice > 0 ? 'START [A]' : 'FREE [A]')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Level Selector Pagination */}
          {!loading && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 40, marginBottom: 20 }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="arcade-btn"
                style={{
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  background: currentPage === 1 ? 'rgba(29, 42, 68, 0.08)' : '#EEDDC2',
                  color: '#1D2A44',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.4 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                <RiArrowLeftLine size={16} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const isCurrent = currentPage === i + 1;
                return (
                  <button 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)}
                    className="arcade-btn font-pixel"
                    style={{
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      fontSize: '10px',
                      background: isCurrent ? '#FF6F3C' : '#EEDDC2',
                      color: isCurrent ? '#FDF6E3' : '#1D2A44',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      boxShadow: isCurrent ? 'none' : '3px 3px 0px #1D2A44',
                      transform: isCurrent ? 'translate(2px, 2px)' : 'none'
                    }}
                  >
                    {i + 1}
                  </button>
                )
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="arcade-btn"
                style={{
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%',
                  background: currentPage === totalPages ? 'rgba(29, 42, 68, 0.08)' : '#EEDDC2',
                  color: '#1D2A44',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.4 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                <RiArrowRightLine size={16} />
              </button>
            </div>
          )}

          {/* Quest Counter count */}
          {!loading && filtered.length > 0 && (
            <p className="font-arcade" style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#5D6D7E', margin: '20px 0 0 0' }}>
              SHOWING STAGES {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} OF {filtered.length} CAMPAIGNS
            </p>
          )}
        </div>
      </section>
    </>
  )
}

export default Courses
