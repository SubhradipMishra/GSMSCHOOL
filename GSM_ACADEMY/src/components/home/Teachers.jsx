import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { RiInstagramLine, RiYoutubeLine } from 'react-icons/ri'

const teachers = [
  { id:1, name:'Guru Radhika Nair', role:'Bharatanatyam', exp:'25+ Yrs', initials:'RN', color:'#c9a84c', bg:'linear-gradient(135deg,#1a3a2a,#2d5940)', award:'National Award Winner', students:'500+', icon:'ri-dance-line' },
  { id:2, name:'Pt. Suresh Kumar', role:'Tabla & Percussion', exp:'30+ Yrs', initials:'SK', color:'#e8c96d', bg:'linear-gradient(135deg,#2d2010,#5a3d1a)', award:'Sangeet Natak Akademi', students:'700+', icon:'ri-rhythm-line' },
  { id:3, name:'Smt. Priya Menon', role:'Kathak & Classical Dance', exp:'20+ Yrs', initials:'PM', color:'#d4a8c9', bg:'linear-gradient(135deg,#3a1a2a,#60304a)', award:'State Kalakara Award', students:'400+', icon:'ri-body-scan-line' },
  { id:4, name:'Dr. Anand Verma', role:'Sanskrit & Vedic Arts', exp:'22+ Yrs', initials:'AV', color:'#a8a8d4', bg:'linear-gradient(135deg,#1a1a3a,#2a2a60)', award:'PhD Sanskrit, BHU', students:'350+', icon:'ri-book-2-line' },
]

const Teachers = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })

  return (
    <section id="teachers" ref={ref}
      style={{ padding:'96px 0', position:'relative', overflow:'hidden', background:'linear-gradient(180deg,#f0e8d0,var(--cream))' }}>
      <div className="pattern-bg" style={{ position:'absolute', inset:0, opacity:0.3, pointerEvents:'none' }} />

      <div className="container" style={{ position:'relative', zIndex:1 }}>
        {/* Header */}
        <motion.div className="text-center" style={{ marginBottom:56 }}
          initial={{ opacity:0, y:30 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:0.6 }}>
          <p className="ornamental-border" style={{ fontSize:11, letterSpacing:'0.12em', fontWeight:600, color:'var(--gold)', marginBottom:12 }}>LEARN FROM THE BEST</p>
          <h2 className="font-cormorant section-heading">Meet Our Teachers</h2>
          <div className="section-divider" style={{ margin:'12px auto 20px' }} />
          <p className="section-sub" style={{ margin:'0 auto' }}>
            Award-winning artists and nationally recognized maestros who bring decades of mastery to every class.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
          {teachers.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity:0, y:40 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ delay:i*0.12, duration:0.6 }}
              className="glass-card card-hover hover-lift"
              style={{ borderRadius:20, overflow:'hidden' }}
              whileHover={{ scale:1.03 }}>

              {/* Avatar */}
              <div style={{ position:'relative', height:220, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:t.bg }}>
                <div style={{ position:'absolute', width:160, height:160, borderRadius:'50%', border:'2px solid white', opacity:0.1 }} />
                <div style={{ position:'absolute', width:112, height:112, borderRadius:'50%', border:'1px solid white', opacity:0.15, transform:'rotate(45deg)' }} />
                <motion.div style={{ position:'relative', zIndex:2, width:96, height:96, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                  background:`rgba(255,255,255,0.08)`, border:`2px solid ${t.color}55` }}
                  animate={{ rotate:[0,5,-5,0] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut', delay:i*0.5 }}>
                  <span className="font-cormorant" style={{ fontWeight:700, fontSize:32, color:t.color }}>{t.initials}</span>
                </motion.div>
                <div style={{ position:'absolute', top:14, right:14, width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                  background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)' }}>
                  <i className={t.icon} style={{ fontSize:16, color:t.color }} />
                </div>
                <div style={{ position:'absolute', bottom:14, left:14, padding:'4px 10px', borderRadius:8, fontSize:11, fontWeight:700,
                  background:'rgba(0,0,0,0.3)', color:t.color, backdropFilter:'blur(8px)', border:`1px solid ${t.color}44` }}>
                  {t.exp} Experience
                </div>
              </div>

              {/* Info */}
              <div style={{ padding:20 }}>
                <h3 className="font-cormorant" style={{ fontWeight:700, fontSize:20, color:'var(--deep-green)', marginBottom:4 }}>{t.name}</h3>
                <p style={{ fontSize:13, fontWeight:600, color:'var(--gold-dark)', marginBottom:8 }}>{t.role}</p>
                <p style={{ fontSize:11, display:'inline-block', padding:'3px 8px', borderRadius:8, marginBottom:12,
                  background:'rgba(201,168,76,0.08)', color:'var(--text-muted)', border:'1px solid rgba(201,168,76,0.15)' }}>
                  🏆 {t.award}
                </p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid rgba(201,168,76,0.15)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <i className="ri-group-line" style={{ fontSize:13, color:'var(--gold)' }} />
                    <span style={{ fontSize:12, color:'var(--text-muted)' }}>{t.students} Students</span>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    {[RiInstagramLine, RiYoutubeLine].map((Icon, j) => (
                      <motion.a key={j} href="#"
                        style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                          background:'rgba(201,168,76,0.1)', color:'var(--gold)', textDecoration:'none' }}
                        whileHover={{ scale:1.2, background:'rgba(201,168,76,0.2)' }}>
                        <Icon size={13} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div className="text-center" style={{ marginTop:48 }}
          initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}} transition={{ delay:0.6 }}>
          <motion.button className="btn-outline"
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 32px', borderRadius:12, fontSize:14 }}
            whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
            <i className="ri-team-line" /> View All Teachers
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Teachers
