import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiTimeLine, RiGroupLine, RiBookOpenLine, RiArrowLeftLine, RiAwardLine, RiShieldUserLine, RiFolderOpenLine } from 'react-icons/ri';
import axios from 'axios';
import Context from '../util/Context';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';

const API_BASE = 'http://localhost:7070';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { session } = useContext(Context);
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        const fetchCourseAndStatus = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE}/admin/public/courses`);
                const found = res.data.courses?.find(c => c._id === id);
                setCourse(found || null);

                // Fetch enrollment status if logged in
                if (session && found) {
                    try {
                        const myRes = await axios.get(`${API_BASE}/course-enrollment/my-courses`, { withCredentials: true });
                        if (myRes.data.success) {
                            const enrolled = myRes.data.enrollments.some(
                                e => (e.courseId?._id || e.courseId)?.toString() === id
                            );
                            setIsEnrolled(enrolled);
                        }
                    } catch (_) { /* not logged in or no enrollments */ }
                }
            } catch (err) {
                console.error("Error loading course details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseAndStatus();
    }, [id, session]);

    const handleEnrollOrBuy = async () => {
        if (!session) {
            navigate('/login');
            return;
        }

        const finalPrice = Math.max(0, (course.price || 0) - (course.discount || 0));
        if (finalPrice === 0) {
            try {
                setEnrolling(true);
                const res = await axios.post(`${API_BASE}/course-enrollment/enroll-free`, { courseId: course._id }, { withCredentials: true });
                if (res.data.success) {
                    setIsEnrolled(true);
                    alert("Enrolled successfully! Redirecting to student dashboard...");
                    navigate('/student/dashboard');
                }
            } catch (err) {
                console.error(err);
                alert("Enrollment failed. Please try again.");
            } finally {
                setEnrolling(false);
            }
        } else {
            navigate(`/courses/${course._id}/checkout`);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', color: 'var(--deep-green)', fontFamily: 'Outfit, sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 50, height: 50, border: '4px solid rgba(201,168,76,0.2)', borderTop: '4px solid var(--gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: 16, fontWeight: 600 }}>Loading course details...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', color: 'var(--deep-green)', padding: 24, fontFamily: 'Outfit, sans-serif' }}>
                <div style={{ textAlign: 'center', maxWidth: 400 }} className="glass-card p-8 rounded-2xl">
                    <RiBookOpenLine size={48} color="var(--gold)" style={{ margin: '0 auto 16px' }} />
                    <h2 className="font-cormorant" style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Course Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>The course you are looking for does not exist or has been removed.</p>
                    <button onClick={() => navigate('/#courses')} className="btn-primary" style={{ width: '100%', padding: '12px 24px', borderRadius: 10 }}>Back to Courses</button>
                </div>
            </div>
        );
    }

    const finalPrice = Math.max(0, (course.price || 0) - (course.discount || 0));

    return (
        <div style={{ background: 'var(--cream)', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
            <Navbar />
            
            {/* Main Content Area */}
            <div style={{ paddingTop: 140, paddingBottom: 80 }} className="container">
                {/* Back Link */}
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--gold-dark)', textDecoration: 'none', fontWeight: 600, marginBottom: 32, transition: '0.2s' }}>
                    <RiArrowLeftLine /> Back to Home
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 48 }} className="grid-2">
                    {/* Course Left Info */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', height: 400, border: '1px solid rgba(201,168,76,0.3)', marginBottom: 32, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
                            {course.thumbnail ? (
                                <img src={`${API_BASE}${course.thumbnail}`} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--deep-green)' }}>
                                    <RiBookOpenLine size={64} color="var(--gold)" />
                                </div>
                            )}
                            {course.category && (
                                <div style={{ position: 'absolute', top: 20, right: 20, padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'rgba(0,0,0,0.7)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.4)', backdropFilter: 'blur(8px)' }}>
                                    {course.category}
                                </div>
                            )}
                            {course.tag && (
                                <div style={{ position: 'absolute', top: 20, left: 20, padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: 'var(--gold)', color: 'var(--deep-green)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                                    {course.tag}
                                </div>
                            )}
                        </div>

                        <h1 className="font-cormorant" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: 'var(--deep-green)', lineHeight: 1.2, marginBottom: 16 }}>
                            {course.title}
                        </h1>

                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
                            {course.duration && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.12)', padding: '6px 14px', borderRadius: 8, fontSize: 13, color: 'var(--ink)' }}>
                                    <RiTimeLine color="var(--gold-dark)" /> <strong>Duration:</strong> {course.duration}
                                </div>
                            )}
                            {course.department && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.12)', padding: '6px 14px', borderRadius: 8, fontSize: 13, color: 'var(--ink)' }}>
                                    <RiFolderOpenLine color="var(--gold-dark)" /> <strong>Department:</strong> {course.department}
                                </div>
                            )}
                        </div>

                        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--deep-green)', marginBottom: 12, borderBottom: '1px solid rgba(201,168,76,0.2)', paddingBottom: 8 }}>Course Description</h3>
                        <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: 40, whiteSpace: 'pre-line' }}>
                            {course.description}
                        </p>

                        {/* Gallery Section */}
                        {course.gallery && course.gallery.length > 0 && (
                            <div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--deep-green)', marginBottom: 16 }}>Course Gallery</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16 }}>
                                    {course.gallery.map((img, idx) => (
                                        <a href={`${API_BASE}${img}`} target="_blank" rel="noreferrer" key={idx} style={{ borderRadius: 12, overflow: 'hidden', height: 90, border: '1px solid rgba(201,168,76,0.2)', display: 'block', transition: '0.2s' }}>
                                            <img src={`${API_BASE}${img}`} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Sidebar Purchase/Enrollment Card */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                        <div className="glass-card" style={{ padding: 32, borderRadius: 24, position: 'sticky', top: 120 }}>
                            <h3 className="font-cormorant" style={{ fontSize: 24, fontWeight: 700, color: 'var(--deep-green)', marginBottom: 24, textAlign: 'center' }}>Course Access</h3>
                            
                            {/* Pricing Box */}
                            <div style={{ textAlign: 'center', marginBottom: 28, background: 'rgba(26,58,42,0.05)', padding: 20, borderRadius: 16, border: '1px solid rgba(201,168,76,0.15)' }}>
                                {finalPrice > 0 ? (
                                    <div>
                                        <p style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 4 }}>Standard Fee</p>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                                            <span style={{ fontSize: 18, textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{course.price}</span>
                                            <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--deep-green)' }}>₹{finalPrice}</span>
                                        </div>
                                        <span style={{ fontSize: 11, background: 'var(--gold)', color: 'var(--deep-green)', padding: '2px 8px', borderRadius: 4, fontWeight: 700, marginTop: 8, display: 'inline-block' }}>
                                            Save ₹{course.discount}
                                        </span>
                                    </div>
                                ) : (
                                    <div>
                                        <span style={{ fontSize: 36, fontWeight: 800, color: 'green' }}>FREE</span>
                                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Access to learning resource at no cost</p>
                                    </div>
                                )}
                            </div>

                            {/* Enrolled Status / Action Button */}
                            {isEnrolled ? (
                                <div>
                                    <div style={{ textAlign: 'center', padding: '12px 0', marginBottom: 12, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 12 }}>
                                        <span style={{ fontWeight: 700, fontSize: 14, color: '#16a34a' }}>✓ You are enrolled in this course</span>
                                    </div>
                                    <button
                                        onClick={() => navigate('/student/dashboard')}
                                        className="btn-primary"
                                        style={{ width: '100%', padding: '16px 24px', borderRadius: 12, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}
                                    >
                                        Go to Classroom →
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleEnrollOrBuy}
                                    disabled={enrolling}
                                    className="btn-primary"
                                    style={{ width: '100%', padding: '16px 24px', borderRadius: 12, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: enrolling ? 0.7 : 1 }}
                                >
                                    {enrolling ? 'Processing...' : finalPrice > 0 ? 'Buy Now' : 'Enroll Free'}
                                </button>
                            )}

                            {/* Value props list */}
                            <div style={{ marginTop: 32, borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: 24 }} className="space-y-4">
                                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-dark)' }}>
                                    <RiAwardLine size={18} color="var(--gold-dark)" style={{ flexShrink: 0, marginTop: 2 }} />
                                    <div>
                                        <strong>Certificate of Completion</strong>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 12 }}>Official certification signed by academy masters.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-dark)', marginTop: 16 }}>
                                    <RiShieldUserLine size={18} color="var(--gold-dark)" style={{ flexShrink: 0, marginTop: 2 }} />
                                    <div>
                                        <strong>Verified Masters</strong>
                                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 12 }}>Instructed by professionals with decades of performance experience.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CourseDetails;
