import React, { useState, useEffect, useRef, useContext } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { RiMapPinLine, RiTimeLine, RiTicketLine, RiDownloadLine, RiLockLine, RiCheckboxCircleLine, RiFileListLine, RiShirtLine, RiAlertLine, RiSkullLine } from 'react-icons/ri'
import { useRazorpay } from 'react-razorpay'
import { useNavigate } from 'react-router-dom'
import Context from '../../util/Context'
import API from '../../api/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const RZP_KEY = 'rzp_test_T8wo3gphNXfk22';

const useCountdown = (targetDate) => {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) {
        setT({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      })
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id)
  }, [targetDate])
  return t
}

const CBox = ({ value, label }) => (
  <div style={{
    background: '#1D2A44',
    border: '3px solid #FF6F3C',
    borderRadius: '12px',
    padding: '12px 18px',
    minWidth: '76px',
    textAlign: 'center',
    boxShadow: '3px 3px 0px #FF6F3C'
  }}>
    <p className="font-pixel" style={{ fontWeight: 'bold', fontSize: '20px', color: '#FDF6E3', margin: 0, lineHeight: 1.1 }}>
      {String(value).padStart(2, '0')}
    </p>
    <p className="font-pixel" style={{ fontSize: '7px', color: '#F5B041', marginTop: 6, margin: 0, letterSpacing: '0.5px' }}>
      {label}
    </p>
  </div>
)

const Events = () => {
  const { session } = useContext(Context)
  const navigate = useNavigate()
  const { Razorpay } = useRazorpay()

  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [dbEvents, setDbEvents] = useState([])
  const [userBookings, setUserBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [bookingInProgress, setBookingInProgress] = useState(false)

  // Fetch events and bookings
  const loadData = async () => {
    try {
      setLoading(true)
      const { data } = await API.get('/events/public/events')
      if (data.success) {
        setDbEvents(data.events)
      }
      
      if (session) {
        const bookingsRes = await API.get('/events/student/bookings')
        if (bookingsRes.data.success) {
          setUserBookings(bookingsRes.data.bookings)
        }
      }
    } catch (err) {
      console.error("Failed to load events data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [session])

  // Get nearest event for countdown banner
  const getNearestEvent = () => {
    if (dbEvents.length === 0) return null;
    const futureEvents = dbEvents.filter(e => new Date(e.date) > new Date());
    if (futureEvents.length === 0) return dbEvents[0];
    return futureEvents[0];
  };

  const nearestEvent = getNearestEvent();
  const cd = useCountdown(nearestEvent ? nearestEvent.date : null);

  const isUserBooked = (eventId) => {
    return userBookings.some(b => b.eventId?._id === eventId && b.status === 'booked');
  };

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
  };

  const handleFreeBooking = async (eventId) => {
    try {
      setBookingInProgress(true)
      const { data } = await API.post('/events/student/bookings/free', { eventId });
      if (data.success) {
        toast.success("🎟️ Party Joined! Confirmation letter added to inventory email.");
        loadData();
        setSelectedEvent(prev => prev ? { ...prev, seatsBooked: (prev.seatsBooked || 0) + 1 } : null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join party");
    } finally {
      setBookingInProgress(false);
    }
  };

  const handlePaidBooking = async (event) => {
    try {
      setBookingInProgress(true);
      const { data } = await API.post('/events/student/bookings/checkout', { eventId: event._id });
      
      const options = {
        key: RZP_KEY,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "GSM ACADEMY",
        description: `Entry Quest: ${event.title}`,
        order_id: data.order.id,
        handler: (response) => {
          toast.success("🎉 Quest Confirmed! Ticket added to inventory. Check email.");
          loadData();
          setSelectedEvent(prev => prev ? { ...prev, seatsBooked: (prev.seatsBooked || 0) + 1 } : null);
          setBookingInProgress(false);
        },
        prefill: {
          name: session?.fullname || "",
          email: session?.email || "",
          contact: session?.mobile || ""
        },
        notes: {
          eventId: event._id,
          studentEmail: session?.email
        },
        modal: {
          ondismiss: () => {
            setBookingInProgress(false);
            toast.warn("Payment checkout closed.");
          }
        },
        theme: {
          color: "#FF6F3C"
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      setBookingInProgress(false);
      toast.error(err.response?.data?.message || "Failed to initiate payment");
    }
  };

  return (
    <>
      {/* Level 5 Connector */}
      <div className="level-connector">
        <div className="level-flag">LEVEL 5: DAILY QUESTS & BOSS EVENTS</div>
      </div>

      <section id="events" ref={ref} style={{ padding: '96px 0', position: 'relative', overflow: 'hidden', background: '#FDF6E3' }}>
        <ToastContainer theme="colored" position="bottom-right" />
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 288, height: 288, borderRadius: '50%', border: '4px dashed rgba(29, 42, 68, 0.05)', pointerEvents: 'none' }} />

        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="font-pixel" style={{ fontSize: '9px', color: '#FF6F3C', margin: '0 0 12px 0' }}>WORLD EVENTS</p>
            <h2 className="font-arcade" style={{ fontSize: '32px', color: '#1D2A44', margin: '0 0 16px 0' }}>ACTIVE GUILD QUESTS</h2>
            <p style={{ color: '#5D6D7E', fontSize: '15px', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 }}>
              Join spectacular celebrations and masterclasses. Form alliances, reserve tickets, and build cultural heritage XP.
            </p>
          </div>

          {/* Quests list */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 64 }}>
            {dbEvents.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', background: 'rgba(29,42,68,0.04)', borderRadius: 20, border: '3px dashed #1D2A44' }}>
                <RiSkullLine size={32} style={{ color: '#FF6F3C', margin: '0 auto 12px' }} />
                <p className="font-arcade" style={{ color: '#1D2A44', fontSize: '16px', margin: 0 }}>NO ACTIVE QUESTS LOGGED</p>
                <p style={{ color: '#5D6D7E', fontSize: '13px', marginTop: 8 }}>Check back later for newly scheduled guild events!</p>
              </div>
            ) : (
              dbEvents.map((ev, i) => {
                const seatsLeft = ev.seat - (ev.seatsBooked || 0);
                const pct = Math.min(100, Math.round(((ev.seatsBooked || 0) / ev.seat) * 100));
                const evDate = new Date(ev.date);
                const day = evDate.getDate();
                const month = evDate.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
                const year = evDate.getFullYear();
                const isBooked = isUserBooked(ev._id);

                return (
                  <motion.div 
                    key={ev._id}
                    className="arcade-card"
                    style={{
                      background: 'rgba(253, 246, 227, 0.9)',
                      boxShadow: '4px 4px 0px #1D2A44',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleRegisterClick(ev)}
                    whileHover={{ scale: 1.02, translateY: -2 }}
                  >
                    <div>
                      {/* Quest Header */}
                      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="font-pixel" style={{
                          fontSize: '8px',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: '#EEDDC2',
                          color: '#1D2A44',
                          border: '2px solid #1D2A44'
                        }}>
                          {ev.subject.toUpperCase()}
                        </span>
                        <span className="font-pixel" style={{ fontSize: '8px', color: ev.price === 0 ? '#2ECC71' : '#FF6F3C' }}>
                          {ev.price === 0 ? 'FREE LOOT' : `COST: ₹${ev.price}`}
                        </span>
                      </div>

                      {/* Quest Info */}
                      <div style={{ padding: '16px 20px 20px' }}>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                          {/* Calendar Node */}
                          <div style={{
                            textAlign: 'center',
                            minWidth: '58px',
                            padding: '10px 8px',
                            background: '#1D2A44',
                            border: '3px solid #1D2A44',
                            borderRadius: '12px',
                            boxShadow: '2px 2px 0px #FF6F3C',
                            color: '#FDF6E3',
                            flexShrink: 0
                          }}>
                            <p className="font-pixel" style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#F5B041' }}>{day}</p>
                            <p className="font-pixel" style={{ fontSize: '8px', margin: '4px 0 2px 0' }}>{month}</p>
                            <p className="font-pixel" style={{ fontSize: '6px', margin: 0, color: '#CCD1D1' }}>{year}</p>
                          </div>
                          
                          <div>
                            <h3 className="font-arcade" style={{ fontSize: '18px', color: '#1D2A44', margin: '0 0 4px 0', lineHeight: 1.2, fontWeight: 'bold' }}>
                              {ev.title}
                            </h3>
                            <p style={{ fontSize: '12px', color: '#5D6D7E', margin: 0 }}>Guild Master: {ev.organiser}</p>
                          </div>
                        </div>

                        <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#5D6D7E', marginBottom: 16 }} className="line-clamp-2">
                          {ev.description}
                        </p>

                        {/* Location Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }} className="font-arcade">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: '#1D2A44' }}>
                            <RiTimeLine size={13} style={{ color: '#FF6F3C' }} />
                            <span>{ev.time}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: '#1D2A44' }}>
                            <RiMapPinLine size={13} style={{ color: '#F5B041' }} />
                            <span className="line-clamp-1">{ev.place}</span>
                          </div>
                        </div>

                        {/* Party Progress Bar */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '9px', fontWeight: 'bold' }} className="font-pixel">
                            <span style={{ color: '#1D2A44' }}>PARTY SIZE: {ev.seatsBooked || 0}</span>
                            <span style={{ color: '#FF6F3C' }}>{pct}% FULL</span>
                          </div>
                          
                          <div className="pixel-progress" style={{ height: 12 }}>
                            <div className="pixel-progress-fill" style={{ width: `${pct}%`, background: '#FF6F3C' }} />
                          </div>
                          
                          <p className="font-pixel" style={{ fontSize: '7px', marginTop: 6, marginBottom: 0, color: seatsLeft <= 5 ? '#E74C3C' : '#5D6D7E', fontWeight: 'bold' }}>
                            {seatsLeft <= 0 ? 'PARTY OVERFLOW (FULL)' : `ONLY ${seatsLeft} SLOTS REMAINING`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Book Buttons */}
                    <div style={{ padding: '0 20px 20px' }}>
                      {isBooked ? (
                        <button className="arcade-btn" style={{ width: '100%', padding: '10px 0', borderRadius: 12, fontSize: '11px', color: '#2ECC71', border: '3px solid #2ECC71', background: 'rgba(46, 204, 113, 0.1)', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                          <RiCheckboxCircleLine size={14} /> QUEST JOINED ✓
                        </button>
                      ) : seatsLeft <= 0 ? (
                        <button className="arcade-btn" style={{ width: '100%', padding: '10px 0', borderRadius: 12, fontSize: '11px', color: '#E74C3C', border: '3px solid #E74C3C', background: 'rgba(231, 76, 60, 0.1)', cursor: 'not-allowed', opacity: 0.6 }} onClick={(e) => e.stopPropagation()}>
                          SLOTS EXHAUSTED
                        </button>
                      ) : (
                        <button 
                          className="arcade-btn btn-primary"
                          style={{ width: '100%', padding: '10px 0', borderRadius: 12, fontSize: '11px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRegisterClick(ev);
                          }}
                        >
                          <RiTicketLine /> ENTER QUEST [B]
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>

          {/* Boss Event Countdown Banner */}
          {nearestEvent && (
            <motion.div 
              className="arcade-card-dark crt-screen"
              style={{
                borderRadius: '28px',
                padding: '48px 32px',
                textAlign: 'center',
                border: '4px solid #1D2A44',
                background: '#1D2A44',
                boxShadow: '8px 8px 0px #FF6F3C'
              }}
            >
              <p className="font-pixel" style={{ fontSize: '8px', color: '#FF6F3C', marginBottom: 12, letterSpacing: '1.5px' }}>🚨 INCOMING WORLD BOSS EVENT 🚨</p>
              <h3 className="font-arcade" style={{ fontSize: '26px', color: '#FDF6E3', margin: '0 0 10px 0', fontWeight: 'bold' }}>{nearestEvent.title.toUpperCase()}</h3>
              <p className="font-pixel" style={{ fontSize: '8px', color: '#CCD1D1', marginBottom: 28 }}>EVENT BEGINS IN</p>
              
              {/* Countdown Grid */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
                <CBox value={cd.days} label="DAYS" />
                <span className="font-pixel" style={{ fontSize: '18px', color: '#FF6F3C' }}>:</span>
                <CBox value={cd.hours} label="HOURS" />
                <span className="font-pixel" style={{ fontSize: '18px', color: '#FF6F3C' }}>:</span>
                <CBox value={cd.minutes} label="MINS" />
                <span className="font-pixel" style={{ fontSize: '18px', color: '#FF6F3C' }}>:</span>
                <CBox value={cd.seconds} label="SECS" />
              </div>

              <button 
                className="arcade-btn btn-secondary"
                style={{ padding: '12px 36px', borderRadius: '12px', fontSize: '12px' }}
                onClick={() => handleRegisterClick(nearestEvent)}
              >
                <RiTicketLine /> REGISTER NOW [A]
              </button>
            </motion.div>
          )}
        </div>

        {/* Quest detail Retro Scroll Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="arcade-card crt-screen"
                style={{
                  background: '#FDF6E3',
                  padding: '32px 24px',
                  width: '100%',
                  maxW: '540px',
                  maxWidth: '540px',
                  boxShadow: '12px 12px 0px #1D2A44',
                  maxHeight: '85vh',
                  overflowY: 'auto',
                  color: '#1D2A44'
                }}
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedEvent(null)} 
                  className="absolute top-4 right-4 font-pixel" 
                  style={{ background: 'none', border: 'none', color: '#1D2A44', fontSize: '16px', cursor: 'pointer' }}
                >
                  ✕
                </button>
                
                <span className="font-pixel" style={{
                  fontSize: '8px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: '#EEDDC2',
                  border: '2px solid #1D2A44',
                  color: '#1D2A44'
                }}>
                  {selectedEvent.subject.toUpperCase()}
                </span>
                
                <h2 className="font-arcade" style={{ fontSize: '24px', color: '#1D2A44', margin: '14px 0 10px 0', fontWeight: 'bold' }}>
                  {selectedEvent.title}
                </h2>
                
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#5D6D7E', marginBottom: 20 }}>
                  {selectedEvent.description}
                </p>
                
                {/* Scroll Detail Info grid */}
                <div style={{
                  background: '#EEDDC2',
                  border: '3px solid #1D2A44',
                  borderRadius: '16px',
                  padding: '18px',
                  marginBottom: 20
                }} className="space-y-4">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <RiMapPinLine size={16} style={{ color: '#FF6F3C', marginTop: 2 }} />
                    <div>
                      <p className="font-pixel" style={{ fontSize: '8px', color: '#1D2A44', margin: '0 0 2px 0' }}>LOCATION VENUE</p>
                      <p className="font-arcade" style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>{selectedEvent.place}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <RiTimeLine size={16} style={{ color: '#FF6F3C', marginTop: 2 }} />
                      <div>
                        <p className="font-pixel" style={{ fontSize: '7px', color: '#1D2A44', margin: '0 0 2px 0' }}>DATE & TIME</p>
                        <p className="font-arcade" style={{ fontSize: '11px', fontWeight: 'bold', margin: 0 }}>
                          {new Date(selectedEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} @ {selectedEvent.time}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <RiTicketLine size={16} style={{ color: '#FF6F3C', marginTop: 2 }} />
                      <div>
                        <p className="font-pixel" style={{ fontSize: '7px', color: '#1D2A44', margin: '0 0 2px 0' }}>ORGANISER</p>
                        <p className="font-arcade" style={{ fontSize: '11px', fontWeight: 'bold', margin: 0 }}>{selectedEvent.organiser}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 12, borderTop: '2px dashed rgba(29, 42, 68, 0.15)' }}>
                    <div>
                      <p className="font-pixel" style={{ fontSize: '7px', color: '#5D6D7E', margin: '0 0 2px 0' }}>QUEST PRICE</p>
                      <p className="font-pixel" style={{ fontSize: '11px', fontWeight: 'bold', color: '#FF6F3C', margin: 0 }}>
                        {selectedEvent.price === 0 ? 'FREE LOOT' : `₹${selectedEvent.price}`}
                      </p>
                    </div>
                    <div>
                      <p className="font-pixel" style={{ fontSize: '7px', color: '#5D6D7E', margin: '0 0 2px 0' }}>PARTY SLOTS</p>
                      <p className="font-arcade" style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>
                        {selectedEvent.seat - (selectedEvent.seatsBooked || 0)} / {selectedEvent.seat} LEFT
                      </p>
                    </div>
                  </div>

                  {selectedEvent.dressCode && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingTop: 12, borderTop: '2px dashed rgba(29, 42, 68, 0.15)' }}>
                      <RiShirtLine size={16} style={{ color: '#FF6F3C', marginTop: 2 }} />
                      <div>
                        <p className="font-pixel" style={{ fontSize: '7px', color: '#1D2A44', margin: '0 0 2px 0' }}>DRESS CODE REQUIREMENT</p>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', margin: 0 }}>{selectedEvent.dressCode}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Important Notes */}
                {selectedEvent.notes && (
                  <div style={{
                    background: 'rgba(245, 176, 65, 0.15)',
                    border: '2px solid #F5B041',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    marginBottom: 20,
                    display: 'flex',
                    gap: 8
                  }}>
                    <RiAlertLine size={18} style={{ color: '#FF6F3C', flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p className="font-pixel" style={{ fontSize: '7px', color: '#FF6F3C', margin: '0 0 2px 0' }}>CRITICAL QUEST INSTRUCTIONS</p>
                      <p style={{ fontSize: '11px', color: '#1D2A44', margin: 0, lineHeight: 1.4 }}>{selectedEvent.notes}</p>
                    </div>
                  </div>
                )}

                {/* Brochure Attachment */}
                {selectedEvent.documentUrl && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(29, 42, 68, 0.05)',
                    border: '2px dashed #1D2A44',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    marginBottom: 20
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <RiFileListLine size={18} style={{ color: '#FF6F3C' }} />
                      <span className="font-arcade" style={{ fontSize: '11px', fontWeight: 'bold', color: '#1D2A44' }}>QUEST SCROLL / BROCHURE</span>
                    </div>
                    <a 
                      href={`http://localhost:7070${selectedEvent.documentUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="arcade-btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '10px', textDecoration: 'none', borderRadius: '8px' }}
                    >
                      <RiDownloadLine /> GET LOOT
                    </a>
                  </div>
                )}

                {/* RSVP / Booking Action Button */}
                <div style={{ paddingTop: 8 }}>
                  {!session ? (
                    <button 
                      onClick={() => {
                        setSelectedEvent(null);
                        navigate('/login');
                      }}
                      className="arcade-btn btn-primary"
                      style={{ width: '100%', padding: '12px 0', borderRadius: '12px', fontSize: '12px' }}
                    >
                      <RiLockLine /> INSERT COIN [LOG IN] TO REGISTER
                    </button>
                  ) : isUserBooked(selectedEvent._id) ? (
                    <div className="font-arcade" style={{
                      width: '100%',
                      background: 'rgba(46, 204, 113, 0.15)',
                      border: '3px solid #2ECC71',
                      color: '#2ECC71',
                      padding: '12px 0',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      fontSize: '13px'
                    }}>
                      ✓ YOU ARE REGISTERED IN THIS PARTY PARTY_SLOT
                    </div>
                  ) : selectedEvent.seat - (selectedEvent.seatsBooked || 0) <= 0 ? (
                    <div className="font-pixel" style={{
                      width: '100%',
                      background: 'rgba(231, 76, 60, 0.15)',
                      border: '3px solid #E74C3C',
                      color: '#E74C3C',
                      padding: '12px 0',
                      borderRadius: '12px',
                      textAlign: 'center',
                      fontSize: '9px'
                    }}>
                      PARTY IS FULL (EXHAUSTED)
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        if (selectedEvent.price === 0) {
                          handleFreeBooking(selectedEvent._id);
                        } else {
                          handlePaidBooking(selectedEvent);
                        }
                      }}
                      disabled={bookingInProgress}
                      className="arcade-btn btn-primary animate-pulse"
                      style={{ width: '100%', padding: '14px 0', borderRadius: '12px', fontSize: '12px' }}
                    >
                      <RiTicketLine /> {bookingInProgress ? 'TRANSMITTING QUEST TICKET...' : selectedEvent.price === 0 ? 'RESERVE FREE SLOT [A]' : `PAY & JOIN RAID (₹${selectedEvent.price}) [A]`}
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}

export default Events;
