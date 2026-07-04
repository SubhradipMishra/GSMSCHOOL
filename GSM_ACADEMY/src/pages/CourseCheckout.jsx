import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiShoppingBagLine, RiShieldCheckLine, RiSecurePaymentLine, RiUserLine, RiMailLine, RiPhoneLine, RiCheckboxCircleLine, RiErrorWarningLine, RiBookOpenLine } from 'react-icons/ri';
import axios from 'axios';
import Context from '../util/Context';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';
import { useRazorpay } from 'react-razorpay';

const API_BASE = 'http://localhost:7070';
const RZP_KEY = 'rzp_test_T8wo3gphNXfk22';

// ─── Toast Notification ──────────────────────────────────────────────────────
const Toast = ({ toast, onClose }) => {
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(onClose, 5000);
        return () => clearTimeout(t);
    }, [toast, onClose]);

    if (!toast) return null;
    const isSuccess = toast.type === 'success';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -60, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -60, scale: 0.9 }}
                style={{
                    position: 'fixed', top: 24, right: 24, zIndex: 9999,
                    background: isSuccess ? 'linear-gradient(135deg,#1a3a2a,#0d2b1d)' : 'linear-gradient(135deg,#3a1a1a,#2b0d0d)',
                    border: `1px solid ${isSuccess ? '#c9a84c' : '#ef4444'}`,
                    borderRadius: 16, padding: '16px 24px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    boxShadow: `0 8px 40px ${isSuccess ? 'rgba(201,168,76,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    minWidth: 320, maxWidth: 420,
                }}
            >
                {isSuccess
                    ? <RiCheckboxCircleLine size={24} color="#c9a84c" style={{ flexShrink: 0 }} />
                    : <RiErrorWarningLine size={24} color="#ef4444" style={{ flexShrink: 0 }} />
                }
                <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: isSuccess ? '#c9a84c' : '#ef4444', margin: 0 }}>{toast.title}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: '4px 0 0' }}>{toast.message}</p>
                </div>
                <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 18, lineHeight: 1 }}>×</button>
            </motion.div>
        </AnimatePresence>
    );
};

const CourseCheckout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { Razorpay } = useRazorpay();
    const { session, sessionLoading } = useContext(Context);

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (type, title, message) => setToast({ type, title, message });
    const clearToast = () => setToast(null);

    // User Prefill details
    const [billingInfo, setBillingInfo] = useState({
        fullname: '',
        email: '',
        mobile: ''
    });

    useEffect(() => {
        if (!sessionLoading && !session) {
            navigate('/login');
        }
    }, [session, sessionLoading, navigate]);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE}/admin/public/courses`);
                const found = res.data.courses?.find(c => c._id === id);
                setCourse(found || null);

                if (session) {
                    setBillingInfo({
                        fullname: session.fullname || '',
                        email: session.email || '',
                        mobile: session.mobile || ''
                    });
                }
            } catch (err) {
                console.error("Error loading course details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id, session]);


    const handlePayment = async () => {
        try {
            setProcessing(true);
            console.log("Initiating payment for:", course);

            const { data } = await axios.post(`${API_BASE}/payment/course/order`, {
                courseId: course._id,
            }, { withCredentials: true });

            console.log("Order data:", data);

            const options = {
                key: RZP_KEY,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "GSM ACADEMY",
                description: `Enrollment for ${course.title}`,
                image: "/" + import.meta.env.VITE_LOGO,
                order_id: data.order.id,
                handler: (response) => {
                    console.log("Payment Response:", response);
                    setProcessing(false);
                    showToast(
                        'success',
                        '🎉 Enrollment Confirmed!',
                        `Payment successful! Check your email for the enrollment receipt. Redirecting to dashboard...`
                    );
                    // Redirect to dashboard after 3 seconds
                    setTimeout(() => navigate('/student/dashboard'), 3000);
                },
                prefill: {
                    name: billingInfo.fullname,
                    email: billingInfo.email,
                    contact: billingInfo.mobile
                },
                notes: {
                    address: "Online Course Enrollment",
                    fullname: billingInfo.fullname,
                    email: billingInfo.email,
                    mobile: billingInfo.mobile,
                    courseId: course._id,
                    discount: discountAmount,
                    originalPrice: originalPrice
                },
                modal: {
                    ondismiss: () => {
                        setProcessing(false);
                        showToast('error', 'Payment Cancelled', 'You closed the payment window. You can try again anytime.');
                    }
                },
                theme: {
                    color: "#c9a84c"
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();

            rzp.on("payment.failed", (error) => {
                console.log("Payment Failed:", error);
                setProcessing(false);
                showToast(
                    'error',
                    '❌ Payment Failed',
                    error?.error?.description || 'Your payment could not be processed. Please try again.'
                );
            });
        }
        catch (err) {
            setProcessing(false);
            if (err.status === 401) return navigate("/login");
            console.log("Payment Error:", err);
            showToast('error', 'Error', 'Failed to initiate payment. Please try again.');
        }
    };


    if (loading || sessionLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', color: 'var(--deep-green)', fontFamily: 'Outfit, sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 50, height: 50, border: '4px solid rgba(201,168,76,0.2)', borderTop: '4px solid var(--gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: 16, fontWeight: 600 }}>Loading checkout...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', color: 'var(--deep-green)', padding: 24, fontFamily: 'Outfit, sans-serif' }}>
                <div style={{ textAlign: 'center', maxWidth: 400 }} className="glass-card p-8 rounded-2xl">
                    <RiBookOpenLine size={48} style={{ margin: '0 auto 16px', display: 'block', color: 'var(--gold)' }} />
                    <h2 className="font-cormorant" style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Course Not Found</h2>
                    <button onClick={() => navigate('/courses')} className="btn-primary" style={{ width: '100%', padding: '12px 24px', borderRadius: 10 }}>Browse Courses</button>
                </div>
            </div>
        );
    }

    const originalPrice = course.price || 0;
    const discountAmount = course.discount || 0;
    const finalPrice = Math.max(0, originalPrice - discountAmount);

    return (
        <div style={{ background: 'var(--cream)', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' }}>
            <Navbar />

            {/* Toast */}
            <Toast toast={toast} onClose={clearToast} />

            <div style={{ paddingTop: 140, paddingBottom: 80 }} className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 40 }} className="grid-2">
                    {/* Left Panel: Billing Details */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="glass-card" style={{ padding: 32, borderRadius: 24 }}>
                            <h2 className="font-cormorant" style={{ fontSize: 28, fontWeight: 700, color: 'var(--deep-green)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <RiUserLine size={24} color="var(--gold-dark)" /> Billing Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <RiUserLine style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-dark)' }} />
                                        <input
                                            type="text"
                                            value={billingInfo.fullname}
                                            readOnly
                                            style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12, border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(255,255,255,0.4)', color: 'var(--ink)', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Email Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <RiMailLine style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-dark)' }} />
                                        <input
                                            type="email"
                                            value={billingInfo.email}
                                            readOnly
                                            style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12, border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(255,255,255,0.4)', color: 'var(--ink)', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Phone Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <RiPhoneLine style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-dark)' }} />
                                        <input
                                            type="tel"
                                            value={billingInfo.mobile}
                                            readOnly
                                            style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12, border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(255,255,255,0.4)', color: 'var(--ink)', outline: 'none' }}
                                        />
                                    </div>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>* Details are retrieved from your enrollment profile.</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Panel: Order Summary */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                        <div className="glass-card" style={{ padding: 32, borderRadius: 24, height: 'fit-content' }}>
                            <h2 className="font-cormorant" style={{ fontSize: 26, fontWeight: 700, color: 'var(--deep-green)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: 12 }}>
                                <RiShoppingBagLine size={24} color="var(--gold-dark)" /> Order Summary
                            </h2>

                            {/* Course Item Row */}
                            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                                <div style={{ width: 70, height: 70, borderRadius: 12, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(201,168,76,0.2)' }}>
                                    {course.thumbnail ? (
                                        <img src={`${API_BASE}${course.thumbnail}`} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--deep-green)' }}>
                                            <RiBookOpenLine size={24} color="var(--gold)" />
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--deep-green)', margin: 0 }}>{course.title}</h4>
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{course.department}</span>
                                </div>
                            </div>

                            {/* Pricing summary details */}
                            <div style={{ borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: 16, marginBottom: 24 }} className="space-y-3">
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Original Price</span>
                                    <span style={{ color: 'var(--ink)' }}>₹{originalPrice}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'green' }}>
                                        <span>Discount</span>
                                        <span>-₹{discountAmount}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: 'var(--deep-green)', borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: 12 }}>
                                    <span>Total Payable</span>
                                    <span>₹{finalPrice}</span>
                                </div>
                            </div>

                            {/* Trust signals */}
                            <div style={{ background: 'rgba(26,58,42,0.03)', padding: 16, borderRadius: 12, border: '1px solid rgba(201,168,76,0.1)', display: 'flex', gap: 12, marginBottom: 28 }}>
                                <RiShieldCheckLine size={24} color="var(--gold-dark)" style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                    Secure payments processed via Razorpay. Your credentials and transactions are protected by industry-standard encryption protocols.
                                </span>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="btn-primary"
                                style={{
                                    width: '100%', padding: '16px 24px', borderRadius: 12,
                                    fontSize: 15, fontWeight: 700, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: 8,
                                    opacity: processing ? 0.7 : 1,
                                    cursor: processing ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <RiSecurePaymentLine size={18} />
                                {processing ? 'Initiating Secure Gateway...' : `Pay ₹${finalPrice} with Razorpay`}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
                                A confirmation email will be sent to <strong>{billingInfo.email}</strong> after successful payment.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CourseCheckout;
