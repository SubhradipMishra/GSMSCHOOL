import React, { useState, useEffect, useRef, useContext } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { RiMapPinLine, RiTimeLine, RiTicketLine, RiDownloadLine, RiLockLine, RiCheckboxCircleLine, RiFileListLine, RiShirtLine, RiAlertLine } from 'react-icons/ri'
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
  <div className="countdown-box" style={{
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: '12px',
    padding: '12px 18px',
    minWidth: '70px',
    textAlign: 'center'
  }}>
    <p className="font-cormorant" style={{ fontWeight: 700, fontSize: 32, color: 'var(--gold)', margin: 0, lineHeight: 1 }}>{String(value).padStart(2, '0')}</p>
    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
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
        toast.success("🎟️ Seat Booked Successfully! Confirmation email sent.");
        // Reload details
        loadData();
        // Update selected event details in modal
        setSelectedEvent(prev => prev ? { ...prev, seatsBooked: (prev.seatsBooked || 0) + 1 } : null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book seat");
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
        description: `Event Entry: ${event.title}`,
        order_id: data.order.id,
        handler: (response) => {
          toast.success("🎉 Payment Successful! Your seat is booked. Ticket details sent to email.");
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
            toast.warn("Payment window closed.");
          }
        },
        theme: {
          color: "#c9a84c"
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      setBookingInProgress(false);
      toast.error(err.response?.data?.message || "Failed to initiate checkout");
    }
  };

  return (
    <section id="events" ref={ref}
      style={{ padding: '96px 0', position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,#f0e8d0,var(--cream))' }}>
      <ToastContainer theme="dark" position="bottom-right" />
      <div style={{ position: 'absolute', top: 0, right: 0, width: 288, height: 288, borderRadius: '50%', background: 'radial-gradient(circle,var(--gold),transparent)', opacity: 0.04, transform: 'translate(30%,-30%)', pointerEvents: 'none' }} />

      <div className="container">
        {/* Header */}
        <motion.div className="text-center" style={{ marginBottom: 48 }}
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <p className="ornamental-border" style={{ fontSize: 11, letterSpacing: '0.12em', fontWeight: 600, color: 'var(--gold)', marginBottom: 12 }}>MARK YOUR CALENDAR</p>
          <h2 className="font-cormorant section-heading">Upcoming Cultural Events</h2>
          <div className="section-divider" style={{ margin: '12px auto 20px' }} />
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Join us for spectacular celebrations that bring our cultural community together in joy and artistry.
          </p>
        </motion.div>

        {/* Dynamic Event cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 48 }}>
          {dbEvents.length === 0 ? (
            <div className="col-span-full text-center py-10" style={{ color: 'var(--deep-green)', opacity: 0.6 }}>
              <p className="font-medium">No events scheduled at the moment. Check back soon!</p>
            </div>
          ) : (
            dbEvents.map((ev, i) => {
              const seatsLeft = ev.seat - (ev.seatsBooked || 0);
              const pct = Math.round(((ev.seatsBooked || 0) / ev.seat) * 100);
              const evDate = new Date(ev.date);
              const day = evDate.getDate();
              const month = evDate.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
              const year = evDate.getFullYear();
              const isBooked = isUserBooked(ev._id);

              return (
                <motion.div key={ev._id}
                  initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.12, duration: 0.6 }}
                  className="hover-lift card-hover"
                  style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.75)',
                    border: '1px solid rgba(201,168,76,0.18)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  onClick={() => handleRegisterClick(ev)}
                  whileHover={{ scale: 1.02 }}>

                  <div>
                    {/* Subject badge */}
                    <div style={{ relative: true, padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{
                        padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                        background: 'rgba(201,168,76,0.15)', color: 'var(--gold-dark)', border: '1px solid rgba(201,168,76,0.3)'
                      }}>
                        {ev.subject}
                      </div>
                      <span className="text-[11px] font-bold" style={{ color: ev.price === 0 ? '#16a34a' : 'var(--gold-dark)' }}>
                        {ev.price === 0 ? 'FREE' : `₹${ev.price}`}
                      </span>
                    </div>

                    <div style={{ padding: '16px 20px 20px' }}>
                      {/* Date + title */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                        <div style={{
                          textAlign: 'center', minWidth: 56, padding: '10px 12px', borderRadius: 12,
                          background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', flexShrink: 0
                        }}>
                          <p className="font-cormorant" style={{ fontWeight: 700, fontSize: 26, lineHeight: 1, color: 'var(--gold-dark)' }}>{day}</p>
                          <p style={{ fontSize: 10, fontWeight: 600, marginTop: 2, color: 'var(--text-muted)' }}>{month}</p>
                          <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{year}</p>
                        </div>
                        <div>
                          <h3 className="font-cormorant text-xl font-bold" style={{ color: 'var(--deep-green)', marginBottom: 4, lineHeight: 1.2 }}>{ev.title}</h3>
                          <p style={{ fontSize: 12, color: 'rgba(26,58,42,0.6)' }}>Organised by: {ev.organiser}</p>
                        </div>
                      </div>

                      <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: 14 }} className="line-clamp-2">{ev.description}</p>

                      {/* Details */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <RiTimeLine size={12} style={{ color: 'var(--gold-dark)' }} />
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ev.time}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <RiMapPinLine size={12} style={{ color: 'var(--gold-dark)' }} />
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }} className="line-clamp-1">{ev.place}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ev.seatsBooked || 0} registered</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold-dark)' }}>{pct}%</span>
                        </div>
                        <div className="prog-bar" style={{ height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <motion.div className="prog-fill"
                            style={{ height: '100%', background: 'var(--gold-dark)', borderRadius: 3 }}
                            initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : {}} transition={{ duration: 1, delay: 0.5 + i * 0.1 }} />
                        </div>
                        <p style={{ fontSize: 11, marginTop: 4, color: seatsLeft <= 5 ? '#e53e3e' : 'var(--text-muted)', fontWeight: seatsLeft <= 5 ? 600 : 400 }}>
                          {seatsLeft <= 0 ? 'Seats Full' : `${seatsLeft} seats left`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '0 20px 20px' }}>
                    {isBooked ? (
                      <button className="btn-outline" style={{ width: '100%', padding: '10px 0', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#16a34a', border: '1px solid #16a34a', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                        <RiCheckboxCircleLine /> Seat Booked
                      </button>
                    ) : seatsLeft <= 0 ? (
                      <button className="btn-outline" style={{ width: '100%', padding: '10px 0', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#ef4444', border: '1px solid #ef4444', opacity: 0.6, cursor: 'not-allowed' }} onClick={(e) => e.stopPropagation()}>
                        Seats Full
                      </button>
                    ) : (
                      <button className="btn-primary"
                        style={{ width: '100%', padding: '10px 0', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegisterClick(ev);
                        }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                        <RiTicketLine /> Book Ticket
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Dynamic Countdown Banner */}
        {nearestEvent && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              borderRadius: 28, padding: '48px 32px', textAlign: 'center',
              background: 'linear-gradient(135deg,var(--deep-green),var(--deep-green-light))', border: '1px solid rgba(201,168,76,0.25)'
            }}>
            <p style={{ fontSize: 11, letterSpacing: '0.12em', fontWeight: 600, color: 'var(--gold)', marginBottom: 8 }}>NEXT EVENT COUNTDOWN</p>
            <h3 className="font-cormorant text-2xl font-bold" style={{ color: 'white', marginBottom: 6 }}>{nearestEvent.title}</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>Event starts in</p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
              <CBox value={cd.days} label="Days" />
              <span className="font-cormorant" style={{ fontWeight: 700, fontSize: 32, color: 'var(--gold)' }}>:</span>
              <CBox value={cd.hours} label="Hours" />
              <span className="font-cormorant" style={{ fontWeight: 700, fontSize: 32, color: 'var(--gold)' }}>:</span>
              <CBox value={cd.minutes} label="Mins" />
              <span className="font-cormorant" style={{ fontWeight: 700, fontSize: 32, color: 'var(--gold)' }}>:</span>
              <CBox value={cd.seconds} label="Secs" />
            </div>

            <motion.button className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 32px', borderRadius: 12, fontSize: 14 }}
              onClick={() => handleRegisterClick(nearestEvent)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <RiTicketLine /> Register Now
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Dynamic Detail & Booking Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-white/20 p-8 rounded-2xl w-full max-w-xl shadow-2xl relative max-h-[85vh] overflow-y-auto text-white"
            >
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
              
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                {selectedEvent.subject}
              </span>
              
              <h2 className="text-3xl font-bold text-gold mt-2 mb-4 font-cormorant">{selectedEvent.title}</h2>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">{selectedEvent.description}</p>
              
              <div className="bg-white/5 border border-white/10 p-5 rounded-xl space-y-3 mb-6 text-sm">
                <div className="flex items-center gap-3">
                  <RiMapPinLine size={16} className="text-gold" />
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Venue</p>
                    <p className="font-semibold">{selectedEvent.place}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <RiTimeLine size={16} className="text-gold" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date & Time</p>
                      <p className="font-semibold">{new Date(selectedEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} @ {selectedEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RiTicketLine size={16} className="text-gold" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Organiser</p>
                      <p className="font-semibold">{selectedEvent.organiser}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Price</p>
                    <p className="font-semibold text-lg text-gold">{selectedEvent.price === 0 ? 'FREE' : `₹${selectedEvent.price}`}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Available Seats</p>
                    <p className="font-semibold text-lg">{selectedEvent.seat - (selectedEvent.seatsBooked || 0)} / {selectedEvent.seat}</p>
                  </div>
                </div>
                {selectedEvent.dressCode && (
                  <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                    <RiShirtLine size={16} className="text-gold" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Dress Code</p>
                      <p className="font-semibold">{selectedEvent.dressCode}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedEvent.notes && (
                <div className="bg-gold/5 border border-gold/15 p-4 rounded-xl mb-6 flex gap-2">
                  <RiAlertLine size={18} className="text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-gold uppercase tracking-wider mb-0.5">Important Notes</p>
                    <p className="text-xs text-gray-300 leading-relaxed">{selectedEvent.notes}</p>
                  </div>
                </div>
              )}

              {selectedEvent.documentUrl && (
                <div className="mb-6 flex justify-between items-center bg-white/5 border border-white/5 p-3.5 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <RiFileListLine size={18} className="text-gold" />
                    <span className="text-xs text-gray-300 font-medium">Event Brochure / Attachment</span>
                  </div>
                  <a 
                    href={`http://localhost:7070${selectedEvent.documentUrl}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-gold hover:text-black px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    <RiDownloadLine /> Download
                  </a>
                </div>
              )}

              {/* Booking Actions */}
              <div className="pt-2">
                {!session ? (
                  <button 
                    onClick={() => {
                      setSelectedEvent(null);
                      navigate('/login');
                    }}
                    className="w-full bg-gold text-black py-3 rounded-xl font-bold hover:bg-yellow-600 transition flex items-center justify-center gap-2"
                  >
                    <RiLockLine /> Log in to Book Seat
                  </button>
                ) : isUserBooked(selectedEvent._id) ? (
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                    <RiCheckboxCircleLine size={18} /> You are registered for this event!
                  </div>
                ) : selectedEvent.seat - (selectedEvent.seatsBooked || 0) <= 0 ? (
                  <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 py-3 rounded-xl font-bold text-center">
                    Seats Full
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
                    className="w-full bg-gradient-to-r from-gold to-yellow-600 text-black py-3.5 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <RiTicketLine /> {bookingInProgress ? 'Processing Booking...' : selectedEvent.price === 0 ? 'Reserve Free Seat' : `Pay & Confirm Seat (₹${selectedEvent.price})`}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Events;
