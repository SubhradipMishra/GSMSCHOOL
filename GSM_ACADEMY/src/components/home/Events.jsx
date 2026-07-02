import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { RiMapPinLine, RiTimeLine, RiTicketLine } from 'react-icons/ri'

const events = [
  { id:1, title:'Spring Utsav', subtitle:'A Cultural Celebration', day:'25', month:'MAY', year:'2025', time:'5:00 PM – 9:00 PM', venue:'Main Auditorium, GSM Campus', type:'Annual Festival', featured:true, desc:'A grand annual celebration of spring featuring performances by our students across all art forms.', seats:450, registered:312 },
  { id:2, title:'Guru Poornima', subtitle:'Celebrating Milestones', day:'21', month:'JUL', year:'2025', time:'6:00 PM – 10:00 PM', venue:'Open Air Theatre, GSM', type:'Spiritual Celebration', featured:false, desc:'Honor our beloved teachers on this sacred day with special performances and felicitation ceremony.', seats:300, registered:189 },
  { id:3, title:'Shastriya Sanreet Sandhya', subtitle:'An Evening of Classical Music', day:'15', month:'AUG', year:'2025', time:'7:00 PM – 11:00 PM', venue:'Cultural Hall, GSM Academy', type:'Classical Concert', featured:false, desc:'A soul-stirring evening of Hindustani and Carnatic classical music by masters and senior students.', seats:200, registered:145 },
]

const useCountdown = (target) => {
  const [t, setT] = useState({ days:0, hours:0, minutes:0, seconds:0 })
  useEffect(() => {
    const tick = () => {
      const diff = new Date(target) - new Date()
      if (diff <= 0) return
      setT({ days:Math.floor(diff/86400000), hours:Math.floor((diff/3600000)%24), minutes:Math.floor((diff/60000)%60), seconds:Math.floor((diff/1000)%60) })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [target])
  return t
}

const CBox = ({ value, label }) => (
  <div className="countdown-box">
    <p className="font-cormorant" style={{ fontWeight:700, fontSize:32, color:'var(--gold)' }}>{String(value).padStart(2,'0')}</p>
    <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:4 }}>{label}</p>
  </div>
)

const Events = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })
  const cd = useCountdown('2025-05-25T17:00:00')

  return (
    <section id="events" ref={ref}
      style={{ padding:'96px 0', position:'relative', overflow:'hidden', background:'linear-gradient(180deg,#f0e8d0,var(--cream))' }}>
      <div style={{ position:'absolute', top:0, right:0, width:288, height:288, borderRadius:'50%', background:'radial-gradient(circle,var(--gold),transparent)', opacity:0.04, transform:'translate(30%,-30%)', pointerEvents:'none' }} />

      <div className="container">
        {/* Header */}
        <motion.div className="text-center" style={{ marginBottom:48 }}
          initial={{ opacity:0, y:30 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.6 }}>
          <p className="ornamental-border" style={{ fontSize:11, letterSpacing:'0.12em', fontWeight:600, color:'var(--gold)', marginBottom:12 }}>MARK YOUR CALENDAR</p>
          <h2 className="font-cormorant section-heading">Upcoming Cultural Events</h2>
          <div className="section-divider" style={{ margin:'12px auto 20px' }} />
          <p className="section-sub" style={{ margin:'0 auto' }}>
            Join us for spectacular celebrations that bring our cultural community together in joy and artistry.
          </p>
        </motion.div>

        {/* Event cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, marginBottom:48 }}>
          {events.map((ev, i) => {
            const pct = Math.round((ev.registered / ev.seats) * 100)
            const dark = ev.featured
            return (
              <motion.div key={ev.id}
                initial={{ opacity:0, y:40 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ delay:i*0.12, duration:0.6 }}
                className="hover-lift card-hover"
                style={{ borderRadius:20, overflow:'hidden', cursor:'pointer',
                  background: dark ? 'linear-gradient(135deg,var(--deep-green),var(--deep-green-light))' : 'rgba(255,255,255,0.75)',
                  border: dark ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(201,168,76,0.18)',
                  backdropFilter:'blur(20px)' }}
                whileHover={{ scale:1.02 }}>

                {/* Type badge */}
                <div style={{ position:'relative', padding:'20px 20px 0' }}>
                  <div style={{ position:'absolute', top:16, right:16, padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:600,
                    background:'rgba(201,168,76,0.15)', color:'var(--gold)', border:'1px solid rgba(201,168,76,0.3)' }}>
                    {ev.type}
                  </div>
                </div>

                <div style={{ padding:'16px 20px 20px' }}>
                  {/* Date + title */}
                  <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:14 }}>
                    <div style={{ textAlign:'center', minWidth:56, padding:'10px 12px', borderRadius:12,
                      background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', flexShrink:0 }}>
                      <p className="font-cormorant" style={{ fontWeight:700, fontSize:26, lineHeight:1, color:'var(--gold)' }}>{ev.day}</p>
                      <p style={{ fontSize:10, fontWeight:600, marginTop:2, color: dark ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>{ev.month}</p>
                      <p style={{ fontSize:10, color: dark ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}>{ev.year}</p>
                    </div>
                    <div>
                      <h3 className="font-cormorant" style={{ fontWeight:700, fontSize:20, color: dark ? 'white' : 'var(--deep-green)', marginBottom:4, lineHeight:1.2 }}>{ev.title}</h3>
                      <p style={{ fontSize:13, color: dark ? 'var(--gold)' : 'var(--gold-dark)' }}>{ev.subtitle}</p>
                    </div>
                  </div>

                  <p style={{ fontSize:13, lineHeight:1.7, color: dark ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', marginBottom:14 }}>{ev.desc}</p>

                  {/* Details */}
                  <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
                    {[{ Icon:RiTimeLine, text:ev.time }, { Icon:RiMapPinLine, text:ev.venue }].map(({ Icon, text }) => (
                      <div key={text} style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <Icon size={12} style={{ color:'var(--gold)' }} />
                        <span style={{ fontSize:12, color: dark ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:11, color: dark ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>{ev.registered} registered</span>
                      <span style={{ fontSize:11, fontWeight:700, color:'var(--gold)' }}>{pct}%</span>
                    </div>
                    <div className="prog-bar">
                      <motion.div className="prog-fill"
                        initial={{ width:0 }} animate={inView ? { width:`${pct}%` } : {}} transition={{ duration:1, delay:0.5+i*0.1 }} />
                    </div>
                    <p style={{ fontSize:11, marginTop:4, color: dark ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}>{ev.seats-ev.registered} seats left</p>
                  </div>

                  <motion.button className="btn-primary"
                    style={{ width:'100%', padding:'10px 0', borderRadius:12, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
                    <RiTicketLine /> Register Now
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Countdown */}
        <motion.div initial={{ opacity:0, y:30 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ delay:0.5, duration:0.6 }}
          style={{ borderRadius:28, padding:'48px 32px', textAlign:'center',
            background:'linear-gradient(135deg,var(--deep-green),var(--deep-green-light))', border:'1px solid rgba(201,168,76,0.25)' }}>
          <p style={{ fontSize:11, letterSpacing:'0.12em', fontWeight:600, color:'var(--gold)', marginBottom:8 }}>NEXT EVENT COUNTDOWN</p>
          <h3 className="font-cormorant" style={{ fontWeight:700, fontSize:28, color:'white', marginBottom:6 }}>Spring Utsav 2025</h3>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.6)', marginBottom:32 }}>Event starts in</p>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, flexWrap:'wrap', marginBottom:32 }}>
            <CBox value={cd.days} label="Days" />
            <span className="font-cormorant" style={{ fontWeight:700, fontSize:32, color:'var(--gold)' }}>:</span>
            <CBox value={cd.hours} label="Hours" />
            <span className="font-cormorant" style={{ fontWeight:700, fontSize:32, color:'var(--gold)' }}>:</span>
            <CBox value={cd.minutes} label="Mins" />
            <span className="font-cormorant" style={{ fontWeight:700, fontSize:32, color:'var(--gold)' }}>:</span>
            <CBox value={cd.seconds} label="Secs" />
          </div>
          <motion.button className="btn-primary"
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 32px', borderRadius:12, fontSize:14 }}
            whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
            <RiTicketLine /> Register Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Events
