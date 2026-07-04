import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSearchLine, RiBookOpenLine, RiTimeLine, RiGroupLine, RiArrowLeftLine, RiArrowRightLine, RiFilterLine, RiCloseLine } from 'react-icons/ri';
import axios from 'axios';
import Context from '../util/Context';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';

const API_BASE = 'http://localhost:7070';
const PER_PAGE = 9;

const CoursesPage = () => {
    const { session } = useContext(Context);
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const [cRes, catRes] = await Promise.all([
                    axios.get(`${API_BASE}/admin/public/courses`),
                    axios.get(`${API_BASE}/admin/public/categories`)
                ]);
                setCourses(cRes.data.courses || []);
                setCategories(catRes.data.categories || []);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    useEffect(() => {
        if (!session) { setEnrolledIds([]); return; }
        axios.get(`${API_BASE}/course-enrollment/my-courses`, { withCredentials: true })
            .then(r => { if (r.data.success) setEnrolledIds(r.data.enrollments.map(e => e.courseId?._id || e.courseId)); })
            .catch(() => {});
    }, [session]);

    // Filter + Search + Sort
    let filtered = courses;
    if (activeCategory !== 'All') filtered = filtered.filter(c => c.category === activeCategory);
    if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(c =>
            c.title?.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q) ||
            c.department?.toLowerCase().includes(q) ||
            c.assignedTeacher?.toLowerCase().includes(q) ||
            c.tag?.toLowerCase().includes(q)
        );
    }
    if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sortBy === 'name') filtered = [...filtered].sort((a, b) => (a.title || '').localeCompare(b.title || ''));

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const resetFilters = () => { setSearch(''); setActiveCategory('All'); setSortBy('newest'); setCurrentPage(1); };

    useEffect(() => { setCurrentPage(1); }, [search, activeCategory, sortBy]);

    const handleBuy = async (course) => {
        if (!session) { navigate('/login'); return; }
        const fp = Math.max(0, (course.price || 0) - (course.discount || 0));
        if (fp === 0) {
            try {
                const r = await axios.post(`${API_BASE}/course-enrollment/enroll-free`, { courseId: course._id }, { withCredentials: true });
                if (r.data.success) { alert('Enrolled successfully!'); setEnrolledIds(p => [...p, course._id]); }
            } catch { alert('Failed to enroll'); }
        } else { navigate(`/courses/${course._id}/checkout`); }
    };

    return (
        <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
            <Navbar />
            {/* Hero Banner */}
            <div style={{ paddingTop: 130, paddingBottom: 50, background: 'linear-gradient(180deg, var(--deep-green) 0%, #264a38 100%)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.06), transparent)', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <p className="ornamental-border" style={{ fontSize: 11, letterSpacing: '0.15em', fontWeight: 600, color: 'var(--gold)', marginBottom: 10 }}>EXPLORE & LEARN</p>
                    <h1 className="font-cormorant" style={{ fontSize: 'clamp(2.4rem,5vw,3.6rem)', fontWeight: 800, color: 'white', margin: '0 0 12px' }}>Our Course Catalog</h1>
                    <div className="section-divider" style={{ margin: '0 auto 16px', background: 'var(--gold)', width: 60, height: 3, borderRadius: 2 }} />
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto' }}>
                        Discover classical arts, music, and cultural studies crafted by masters.
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="container" style={{ padding: '32px 24px 0' }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 }}>
                    {/* Search */}
                    <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 400 }}>
                        <RiSearchLine style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-dark)', fontSize: 16 }} />
                        <input
                            value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search courses, teachers, tags..."
                            style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: 14, border: '1px solid rgba(201,168,76,0.25)', background: 'white', fontSize: 14, outline: 'none', color: 'var(--text-dark)' }}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <RiCloseLine size={16} />
                            </button>
                        )}
                    </div>
                    {/* Sort */}
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        style={{ padding: '12px 16px', borderRadius: 14, border: '1px solid rgba(201,168,76,0.25)', background: 'white', fontSize: 13, outline: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}>
                        <option value="newest">Newest First</option>
                        <option value="name">A – Z</option>
                        <option value="price-low">Price: Low → High</option>
                        <option value="price-high">Price: High → Low</option>
                    </select>
                    {(search || activeCategory !== 'All' || sortBy !== 'newest') && (
                        <button onClick={resetFilters} style={{ padding: '10px 18px', borderRadius: 14, border: '1px solid rgba(201,168,76,0.25)', background: 'white', fontSize: 12, cursor: 'pointer', color: 'var(--gold-dark)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <RiFilterLine /> Clear All
                        </button>
                    )}
                </div>

                {/* Category Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                    {[{ name: 'All' }, ...categories].map(cat => {
                        const active = activeCategory === cat.name;
                        return (
                            <motion.button key={cat.name} onClick={() => setActiveCategory(cat.name)}
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                                style={{
                                    padding: '7px 18px', borderRadius: 999, fontSize: 13, fontWeight: active ? 700 : 500, cursor: 'pointer',
                                    background: active ? 'linear-gradient(135deg, var(--gold-dark), var(--gold))' : 'white',
                                    color: active ? 'var(--deep-green)' : 'var(--text-muted)',
                                    border: `1px solid ${active ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`, transition: 'all 0.25s'
                                }}
                            >{cat.name}</motion.button>
                        );
                    })}
                </div>

                {/* Results count */}
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                    Showing <strong style={{ color: 'var(--deep-green)' }}>{filtered.length}</strong> course{filtered.length !== 1 ? 's' : ''}
                    {activeCategory !== 'All' && <> in <strong style={{ color: 'var(--gold-dark)' }}>{activeCategory}</strong></>}
                    {search && <> matching "<strong style={{ color: 'var(--gold-dark)' }}>{search}</strong>"</>}
                </p>
            </div>

            {/* Grid */}
            <div className="container" style={{ padding: '0 24px 40px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                        <div style={{ width: 44, height: 44, border: '3px solid rgba(201,168,76,0.15)', borderTop: '3px solid var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                        <p>Loading courses...</p>
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px 24px' }}>
                        <RiBookOpenLine size={52} style={{ margin: '0 auto 16px', opacity: 0.2, display: 'block', color: 'var(--gold)' }} />
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--deep-green)', marginBottom: 8 }}>No courses found</h3>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Try adjusting your search or filter criteria.</p>
                        <button onClick={resetFilters} className="btn-primary" style={{ padding: '10px 24px', borderRadius: 12 }}>Reset Filters</button>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div key={activeCategory + currentPage + sortBy + search}
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
                            {paginated.map((course, i) => {
                                const fp = Math.max(0, (course.price || 0) - (course.discount || 0));
                                const enrolled = enrolledIds.includes(course._id);
                                return (
                                    <motion.div key={course._id}
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        className="glass-card card-hover"
                                        style={{ borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s' }}
                                        onClick={() => navigate(`/courses/${course._id}`)}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.1)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        {/* Thumbnail */}
                                        <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: 'linear-gradient(135deg,var(--deep-green),var(--deep-green-light))' }}>
                                            {course.thumbnail ? (
                                                <img src={`${API_BASE}${course.thumbnail}`} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <RiBookOpenLine size={36} color="rgba(201,168,76,0.3)" />
                                                </div>
                                            )}
                                            {course.category && (
                                                <div style={{ position: 'absolute', top: 12, right: 12, padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: 'rgba(0,0,0,0.55)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)', backdropFilter: 'blur(8px)' }}>
                                                    {course.category}
                                                </div>
                                            )}
                                            {course.tag && (
                                                <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: 'var(--gold)', color: 'var(--deep-green)' }}>
                                                    {course.tag}
                                                </div>
                                            )}
                                            {enrolled && (
                                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 0', textAlign: 'center', fontSize: 11, fontWeight: 700, background: 'rgba(74,222,128,0.9)', color: '#0a2a1a', letterSpacing: '0.05em' }}>
                                                    ✓ ENROLLED
                                                </div>
                                            )}
                                        </div>

                                        {/* Body */}
                                        <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 className="font-cormorant" style={{ fontWeight: 700, fontSize: 21, color: 'var(--deep-green)', marginBottom: 6, lineHeight: 1.25 }}>{course.title}</h3>
                                            <p style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--text-muted)', marginBottom: 16, flex: 1 }}>
                                                {course.description?.substring(0, 110)}{course.description?.length > 110 ? '...' : ''}
                                            </p>

                                            {/* Price + Duration row */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                                <div>
                                                    {fp > 0 ? (<>
                                                        {course.discount > 0 && <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginRight: 6, fontSize: 12 }}>₹{course.price}</span>}
                                                        <span style={{ fontWeight: 700, color: 'var(--deep-green)', fontSize: 16 }}>₹{fp}</span>
                                                    </>) : (
                                                        <span style={{ fontWeight: 700, color: '#16a34a', background: 'rgba(74,222,128,0.15)', padding: '3px 10px', borderRadius: 6, fontSize: 13 }}>FREE</span>
                                                    )}
                                                </div>
                                                {course.duration && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12 }}>
                                                        <RiTimeLine size={13} color="var(--gold)" /> {course.duration}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Teacher + Dept */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(201,168,76,0.12)', marginBottom: 16, fontSize: 11 }}>
                                                {course.assignedTeacher && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                                                        <RiGroupLine size={12} color="var(--gold)" /> {course.assignedTeacher}
                                                    </div>
                                                )}
                                                {course.department && (
                                                    <span style={{ fontWeight: 500, padding: '3px 8px', borderRadius: 999, background: 'rgba(201,168,76,0.08)', color: 'var(--gold-dark)' }}>{course.department}</span>
                                                )}
                                            </div>

                                            {/* Buttons */}
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {enrolled ? (<>
                                                    <button onClick={e => { e.stopPropagation(); navigate(`/courses/${course._id}`); }} className="btn-outline" style={{ flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                                                        View Details
                                                    </button>
                                                    <button onClick={e => { e.stopPropagation(); navigate('/student/dashboard'); }} className="btn-primary" style={{ flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                                                        Go to Classroom
                                                    </button>
                                                </>) : (<>
                                                    <button onClick={e => { e.stopPropagation(); navigate(`/courses/${course._id}`); }} className="btn-outline" style={{ flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                                                        View Details
                                                    </button>
                                                    <button onClick={e => { e.stopPropagation(); handleBuy(course); }} className="btn-primary" style={{ flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 12, fontWeight: 700 }}>
                                                        {fp > 0 ? 'Buy Now' : 'Enroll Free'}
                                                    </button>
                                                </>)}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 48 }}>
                        <motion.button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            whileHover={currentPage > 1 ? { scale: 1.1 } : {}} whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
                            style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.25)', background: 'white', color: 'var(--deep-green)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <RiArrowLeftLine />
                        </motion.button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <motion.button key={i} onClick={() => setCurrentPage(i + 1)}
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                                style={{
                                    width: 40, height: 40, borderRadius: '50%', fontSize: 14, fontWeight: currentPage === i + 1 ? 700 : 500,
                                    border: `1px solid ${currentPage === i + 1 ? 'var(--gold)' : 'rgba(201,168,76,0.25)'}`,
                                    background: currentPage === i + 1 ? 'linear-gradient(135deg,var(--gold-dark),var(--gold))' : 'white',
                                    color: currentPage === i + 1 ? 'var(--deep-green)' : 'var(--text-muted)', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>{i + 1}</motion.button>
                        ))}
                        <motion.button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            whileHover={currentPage < totalPages ? { scale: 1.1 } : {}} whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
                            style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(201,168,76,0.25)', background: 'white', color: 'var(--deep-green)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <RiArrowRightLine />
                        </motion.button>
                    </div>
                )}
                {!loading && filtered.length > 0 && (
                    <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 12, paddingBottom: 20 }}>
                        Page {currentPage} of {totalPages} · {filtered.length} total courses
                    </p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CoursesPage;
