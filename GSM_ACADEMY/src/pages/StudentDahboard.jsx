import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiBookOpenLine, RiCalendarEventLine, RiTimeLine, RiAwardLine, RiShieldUserLine, RiFlashlightLine, RiAlertLine, RiLockLine, RiRefreshLine } from 'react-icons/ri';
import axios from 'axios';
import Context from '../util/Context';
import StudentSidebar from '../components/student/StudentSidebar';

const API_BASE = 'http://localhost:7070';

const StudentDashboard = () => {
    const { session, sessionLoading } = useContext(Context);
    const navigate = useNavigate();

    const [enrollments, setEnrollments] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sessionLoading && !session) {
            navigate('/login');
        }
    }, [session, sessionLoading, navigate]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!session) return;
            try {
                setLoading(true);
                const [coursesRes, bookingsRes] = await Promise.all([
                    axios.get(`${API_BASE}/course-enrollment/my-courses`, { withCredentials: true }),
                    axios.get(`${API_BASE}/events/student/bookings`, { withCredentials: true })
                ]);
                if (coursesRes.data.success) {
                    setEnrollments(coursesRes.data.enrollments);
                }
                if (bookingsRes.data.success) {
                    setBookings(bookingsRes.data.bookings);
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [session]);

    if (sessionLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#060a08' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <div
                        className="w-14 h-14 rounded-full mx-auto mb-5"
                        style={{
                            border: '3px solid rgba(201,168,76,0.1)',
                            borderTop: '3px solid #c9a84c',
                            animation: 'spin 0.8s linear infinite',
                        }}
                    />
                    <p className="text-sm font-semibold" style={{ color: 'rgba(201,168,76,0.6)' }}>Loading your space...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </motion.div>
            </div>
        );
    }

    const greetingHour = new Date().getHours();
    const greeting = greetingHour < 12 ? 'Good Morning' : greetingHour < 17 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="min-h-screen flex" style={{ background: '#060a08', fontFamily: 'Inter, sans-serif' }}>
            <StudentSidebar />

            {/* Main Content */}
            <main className="flex-1 ml-72 min-h-screen" style={{ background: 'linear-gradient(180deg, #060a08 0%, #0a100d 100%)' }}>
                {/* Top Bar */}
                <div
                    className="px-10 py-5 flex items-center justify-between sticky top-0 z-30"
                    style={{
                        background: 'rgba(6,10,8,0.85)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(201,168,76,0.05)',
                    }}
                >
                    <div>
                        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ color: 'rgba(201,168,76,0.4)' }}>
                            {greeting}
                        </p>
                        <h1 className="text-2xl font-bold text-white mt-0.5">
                            {session?.fullname?.split(' ')[0] || 'Student'}'s Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div
                            className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
                            style={{
                                background: 'rgba(201,168,76,0.08)',
                                border: '1px solid rgba(201,168,76,0.12)',
                                color: '#c9a84c',
                            }}
                        >
                            <RiAwardLine />
                            <span>{enrollments.length} Course{enrollments.length !== 1 ? 's' : ''} Enrolled</span>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="px-10 py-8">

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-3 gap-5 mb-10"
                    >
                        {[
                            {
                                icon: <RiBookOpenLine size={22} />,
                                label: 'Enrolled Courses',
                                value: enrollments.length,
                                gradient: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.03))',
                                border: 'rgba(201,168,76,0.1)',
                                color: '#c9a84c',
                            },
                            {
                                icon: <RiFlashlightLine size={22} />,
                                label: 'Active Courses',
                                value: enrollments.filter(e => e.status === 'enrolled' || e.status === 'ongoing').length,
                                gradient: 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(74,222,128,0.02))',
                                border: 'rgba(74,222,128,0.1)',
                                color: '#4ade80',
                            },
                            {
                                icon: <RiShieldUserLine size={22} />,
                                label: 'Account Status',
                                value: session?.adharNo ? 'Verified' : 'Pending',
                                gradient: 'linear-gradient(135deg, rgba(129,140,248,0.1), rgba(129,140,248,0.02))',
                                border: 'rgba(129,140,248,0.1)',
                                color: '#818cf8',
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 + 0.2 }}
                                className="p-6 rounded-2xl"
                                style={{
                                    background: stat.gradient,
                                    border: `1px solid ${stat.border}`,
                                }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: `${stat.color}15`, color: stat.color }}
                                    >
                                        {stat.icon}
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                                <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Section Title */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-between mb-6"
                    >
                        <div>
                            <h2 className="text-lg font-bold text-white">My Courses</h2>
                            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                                Continue your learning journey
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/#courses')}
                            className="text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-300"
                            style={{
                                color: '#c9a84c',
                                border: '1px solid rgba(201,168,76,0.15)',
                                background: 'rgba(201,168,76,0.05)',
                            }}
                        >
                            + Explore More
                        </button>
                    </motion.div>

                    {/* Courses Grid / Empty State */}
                    <AnimatePresence mode="wait">
                        {enrollments.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="rounded-3xl text-center py-20 px-8"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(201,168,76,0.04), rgba(201,168,76,0.01))',
                                    border: '1px dashed rgba(201,168,76,0.12)',
                                }}
                            >
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                                    style={{
                                        background: 'rgba(201,168,76,0.06)',
                                        border: '1px solid rgba(201,168,76,0.1)',
                                    }}
                                >
                                    <RiBookOpenLine size={32} style={{ color: 'rgba(201,168,76,0.4)' }} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No courses yet</h3>
                                <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                    Your learning journey begins with a single step. Explore our curated courses in classical arts, music, and cultural studies.
                                </p>
                                <button
                                    onClick={() => navigate('/#courses')}
                                    className="px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300"
                                    style={{
                                        background: 'linear-gradient(135deg, #c9a84c, #a08030)',
                                        color: '#0a0f0d',
                                        boxShadow: '0 4px 25px rgba(201,168,76,0.2)',
                                    }}
                                >
                                    Browse Course Catalog
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="courses"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5"
                            >
                                {enrollments.map((enrollment, i) => {
                                    const course = enrollment.courseId;
                                    if (!course) return null;

                                    const statusColors = {
                                        enrolled: { bg: 'rgba(74,222,128,0.1)', text: '#4ade80', border: 'rgba(74,222,128,0.2)' },
                                        ongoing: { bg: 'rgba(96,165,250,0.1)', text: '#60a5fa', border: 'rgba(96,165,250,0.2)' },
                                        completed: { bg: 'rgba(201,168,76,0.1)', text: '#c9a84c', border: 'rgba(201,168,76,0.2)' },
                                        expired: { bg: 'rgba(248,113,113,0.1)', text: '#f87171', border: 'rgba(248,113,113,0.2)' },
                                    };
                                    const sc = statusColors[enrollment.status] || statusColors.enrolled;

                                    return (
                                        <motion.div
                                            key={enrollment._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.08 + 0.5 }}
                                            className="rounded-2xl overflow-hidden flex flex-col group"
                                            style={{
                                                background: 'rgba(255,255,255,0.02)',
                                                border: enrollment.status === 'expired'
                                                    ? '1px solid rgba(248,113,113,0.1)'
                                                    : '1px solid rgba(255,255,255,0.04)',
                                                transition: 'all 0.35s ease',
                                                cursor: enrollment.status === 'expired' ? 'default' : 'pointer',
                                                opacity: enrollment.status === 'expired' ? 0.75 : 1,
                                            }}
                                            onClick={() => enrollment.status !== 'expired' && navigate(`/courses/${course._id}`)}
                                            onMouseEnter={(e) => {
                                                if (enrollment.status === 'expired') return;
                                                e.currentTarget.style.border = '1px solid rgba(201,168,76,0.15)';
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                if (enrollment.status === 'expired') return;
                                                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.04)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            {/* Thumbnail */}
                                            <div className="relative h-40 overflow-hidden" style={{ background: '#0d1a14' }}>
                                                {course.thumbnail ? (
                                                    <img
                                                        src={`${API_BASE}${course.thumbnail}`}
                                                        alt={course.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        style={{ filter: 'brightness(0.8)' }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d1a14, #1a3a2a)' }}>
                                                        <RiBookOpenLine size={36} style={{ color: 'rgba(201,168,76,0.25)' }} />
                                                    </div>
                                                )}

                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(6,10,8,0.9) 100%)' }} />

                                                {/* Expired overlay */}
                                                {enrollment.status === 'expired' && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
                                                        <RiLockLine size={28} style={{ color: '#f87171', marginBottom: 6 }} />
                                                        <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: '#f87171' }}>Access Expired</span>
                                                    </div>
                                                )}

                                                {/* Status badge */}
                                                <div
                                                    className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                                                    style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, backdropFilter: 'blur(8px)' }}
                                                >
                                                    {enrollment.status}
                                                </div>

                                                {/* Category */}
                                                {course.category && (
                                                    <div
                                                        className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                                                        style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(201,168,76,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(201,168,76,0.15)' }}
                                                    >
                                                        {course.category}
                                                    </div>
                                                )}

                                                {/* Tag */}
                                                {course.tag && (
                                                    <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[9px] font-bold" style={{ background: '#c9a84c', color: '#0a0f0d' }}>
                                                        {course.tag}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Body */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
                                                <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                                    {course.description?.substring(0, 100)}...
                                                </p>

                                                {/* Enrolled / End date row */}
                                                <div className="flex items-center gap-4 text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                                                    <div className="flex items-center gap-1.5">
                                                        <RiCalendarEventLine size={13} style={{ color: 'rgba(201,168,76,0.5)' }} />
                                                        <span>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                    {course.duration && (
                                                        <div className="flex items-center gap-1.5">
                                                            <RiTimeLine size={13} style={{ color: 'rgba(201,168,76,0.5)' }} />
                                                            <span>{course.duration}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Ending date + progress bar */}
                                                {(() => {
                                                    const isExpired = enrollment.status === 'expired';
                                                    const isFree = enrollment.isFree;
                                                    const endDate = enrollment.endingDate ? new Date(enrollment.endingDate) : null;
                                                    const enrolledAt = enrollment.enrolledAt ? new Date(enrollment.enrolledAt) : null;
                                                    const now = new Date();

                                                    // days remaining
                                                    const daysLeft = endDate ? Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)) : null;
                                                    // progress (0–100)
                                                    let progress = 100;
                                                    if (!isExpired && endDate && enrolledAt) {
                                                        const total = endDate - enrolledAt;
                                                        const elapsed = now - enrolledAt;
                                                        progress = Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
                                                    }

                                                    // colour logic
                                                    const barColor = isExpired
                                                        ? 'rgba(248,113,113,0.5)'
                                                        : daysLeft !== null && daysLeft <= 7
                                                            ? '#f97316'   // orange — urgent
                                                            : '#c9a84c';  // gold — normal

                                                    return (
                                                        <div className="mb-4">
                                                            {isExpired ? (
                                                                <div
                                                                    className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2"
                                                                    style={{
                                                                        background: 'rgba(248,113,113,0.08)',
                                                                        border: '1px solid rgba(248,113,113,0.2)',
                                                                    }}
                                                                >
                                                                    <RiLockLine size={13} style={{ color: '#f87171', flexShrink: 0 }} />
                                                                    <span className="text-[11px] font-semibold" style={{ color: '#f87171' }}>
                                                                        Access expired on {endDate ? endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                                    </span>
                                                                </div>
                                                            ) : endDate ? (
                                                                <>
                                                                    <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                                                        <span style={{ color: daysLeft !== null && daysLeft <= 7 ? '#f97316' : 'rgba(201,168,76,0.7)' }}>
                                                                            {daysLeft !== null && daysLeft <= 7 && <RiAlertLine size={11} style={{ display: 'inline', marginRight: 3 }} />}
                                                                            {daysLeft !== null
                                                                                ? daysLeft <= 0 ? 'Expired' : `${daysLeft}d left`
                                                                                : 'No expiry'
                                                                            }
                                                                        </span>
                                                                        <span>
                                                                            Expires: {endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                        </span>
                                                                    </div>
                                                                    {/* Progress bar */}
                                                                    <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                                                        <div style={{
                                                                            height: '100%',
                                                                            width: `${progress}%`,
                                                                            borderRadius: 2,
                                                                            background: barColor,
                                                                            transition: 'width 0.6s ease',
                                                                        }} />
                                                                    </div>
                                                                </>
                                                            ) : isFree ? (
                                                                <div className="text-[10px]" style={{ color: 'rgba(74,222,128,0.5)' }}>
                                                                    ✓ Lifetime access (free course)
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    );
                                                })()}

                                                {/* Action button */}
                                                {enrollment.status === 'expired' ? (
                                                    <button
                                                        className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 mt-auto flex items-center justify-center gap-1.5"
                                                        style={{
                                                            background: 'rgba(248,113,113,0.06)',
                                                            border: '1px solid rgba(248,113,113,0.2)',
                                                            color: '#f87171',
                                                            cursor: 'not-allowed',
                                                            opacity: 0.75,
                                                        }}
                                                        disabled
                                                    >
                                                        <RiLockLine size={12} /> Access Expired
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 mt-auto"
                                                        style={{
                                                            background: 'rgba(201,168,76,0.08)',
                                                            border: '1px solid rgba(201,168,76,0.12)',
                                                            color: '#c9a84c',
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/courses/${course._id}`);
                                                        }}
                                                    >
                                                        Continue Learning →
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Booked Events Section */}
                    <div className="mt-14 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-white">My Registered Events</h2>
                                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                                    Your upcoming cultural events & workshops
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/#events')}
                                className="text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-300"
                                style={{
                                    color: '#c9a84c',
                                    border: '1px solid rgba(201,168,76,0.15)',
                                    background: 'rgba(201,168,76,0.05)',
                                }}
                            >
                                + Book New Event
                            </button>
                        </div>

                        {bookings.length === 0 ? (
                            <div
                                className="rounded-3xl text-center py-12 px-8"
                                style={{
                                    background: 'rgba(255,255,255,0.01)',
                                    border: '1px dashed rgba(255,255,255,0.05)',
                                }}
                            >
                                <RiCalendarEventLine size={28} className="mx-auto mb-3" style={{ color: 'rgba(201,168,76,0.3)' }} />
                                <p className="text-sm font-semibold text-white/40">No registered events yet</p>
                                <p className="text-xs text-white/20 mt-1">Book tickets to upcoming cultural festivals and student showcases.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {bookings.map((booking) => {
                                    const event = booking.eventId;
                                    if (!event) return null;
                                    const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric'
                                    });

                                    return (
                                        <motion.div
                                            key={booking._id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="rounded-2xl p-5 flex flex-col justify-between"
                                            style={{
                                                background: 'rgba(255,255,255,0.02)',
                                                border: '1px solid rgba(255,255,255,0.04)',
                                            }}
                                        >
                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                                                        {event.subject}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                        CONFIRMED
                                                    </span>
                                                </div>
                                                <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{event.title}</h3>
                                                <p className="text-xs text-white/40 mb-4 line-clamp-2">{event.description}</p>
                                                
                                                <div className="text-[11px] text-white/50 space-y-1.5 mb-4">
                                                    <div className="flex items-center gap-1.5"><RiCalendarEventLine size={13} style={{ color: '#c9a84c' }} /> <span>{eventDate}</span></div>
                                                    <div className="flex items-center gap-1.5"><RiTimeLine size={13} style={{ color: '#c9a84c' }} /> <span>{event.time}</span></div>
                                                    <div className="flex items-center gap-1.5"><i className="ri-map-pin-line text-[#c9a84c]" /> <span>{event.place}</span></div>
                                                    {event.dressCode && <div className="flex items-center gap-1.5"><i className="ri-shirt-line text-[#c9a84c]" /> <span>Dress Code: {event.dressCode}</span></div>}
                                                </div>

                                                {event.notes && (
                                                    <div className="p-2.5 rounded-lg mb-4 bg-white/[0.02] border border-white/[0.04]">
                                                        <p className="text-[10px] font-bold text-gold uppercase tracking-wider mb-0.5">Note</p>
                                                        <p className="text-[11px] text-white/40 leading-relaxed">{event.notes}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {event.documentUrl && (
                                                <a
                                                    href={`http://localhost:7070${event.documentUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full text-center py-2 rounded-xl text-xs font-semibold bg-gold text-black hover:bg-yellow-600 transition duration-300 flex items-center justify-center gap-1.5 mt-2"
                                                >
                                                    📎 Download Event document
                                                </a>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Profile Info Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-10 p-8 rounded-2xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))',
                            border: '1px solid rgba(255,255,255,0.04)',
                        }}
                    >
                        <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                            <RiShieldUserLine style={{ color: '#c9a84c' }} /> Academic Profile
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Full Name', value: session?.fullname || '—' },
                                { label: 'Email', value: session?.email || '—' },
                                { label: 'Mobile', value: session?.mobile || '—' },
                                { label: 'Gender', value: session?.gender ? session.gender.charAt(0).toUpperCase() + session.gender.slice(1) : '—' },
                                { label: 'Aadhar Verified', value: session?.adharNo ? '✓ Yes' : '✗ No', color: session?.adharNo ? '#4ade80' : '#f87171' },
                                { label: 'Parent/Guardian', value: session?.parentName || '—' },
                                { label: 'Parent Mobile', value: session?.parentMobileNo || '—' },
                                { label: 'Role', value: session?.role ? session.role.charAt(0).toUpperCase() + session.role.slice(1) : 'Student' },
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(201,168,76,0.35)' }}>
                                        {item.label}
                                    </p>
                                    <p className="text-sm font-medium truncate" style={{ color: item.color || 'rgba(255,255,255,0.7)' }}>
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;