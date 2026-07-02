import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { RiArrowRightLine } from 'react-icons/ri'

const timeline = [
  { year:'1998', title:'Foundation', desc:'GSM Academy was founded with a vision to preserve classical Indian arts.' },
  { year:'2003', title:'First Campus', desc:'Established first campus with 200+ students enrolled.' },
  { year:'2009', title:'Recognitions', desc:'Received state award for excellence in cultural education.' },
  { year:'2013', title:'Community', desc:'Grew into a community with 5000+ families.' },
  { year:'2018', title:'Expansion', desc:'Launched digital learning portal across India.' },
  { year:'2023', title:'Excellence', desc:'25+ years of legacy touching 10,000+ lives.' },
]

const pillars = [
  { icon:'ri-ancient-pavilion-line', title:'Cultural Heritage', desc:'Rooted in 5000 years of Indian classical tradition and artistic legacy.' },
  { icon:'ri-user-star-line', title:'Expert Faculty', desc:'Learn from award-winning artists and nationally recognized teachers.' },
  { icon:'ri-seedling-line', title:'Holistic Growth', desc:'Beyond art — developing discipline, focus, and character in students.' },
  { icon:'ri-global-line', title:'Digital Access', desc:'Live and recorded online classes for students across the globe.' },
  { icon:'ri-group-line', title:'Vibrant Community', desc:'10,000+ alumni and families part of our growing cultural family.' },
  { icon:'ri-medal-line', title:'Certified Programs', desc:'Govt. recognised certification with career pathways in performing arts.' },
]

const features = [
  { icon:'ri-dashboard-line', label:'Student Dashboard' },
  { icon:'ri-teacher-line', label:'Teacher Portal' },
  { icon:'ri-calendar-event-line', label:'Event Management' },
  { icon:'ri-secure-payment-line', label:'Online Payments' },
  { icon:'ri-bar-chart-line', label:'Analytics & Insights' },
  { icon:'ri-file-certificate-line', label:'Certificate Mgmt' },
  { icon:'ri-map-pin-user-line', label:'Attendance Tracking' },
  { icon:'ri-shield-check-line', label:'Admin Panel' },
]

const fadeUp = {
  hidden:{ opacity:0, y:40 },
  visible:(i=0) => ({ opacity:1, y:0, transition:{ delay:i*0.09, duration:0.55, ease:'easeOut' } })
}

const About = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:'-80px' })

  return (
    <section id="about" ref={ref} style={{ padding:'96px 0', position:'relative', overflow:'hidden', background:'var(--cream)' }}>
      <div style={{ position:'absolute', top:0, right:0, width:384, height:384, borderRadius:'50%', background:'radial-gradient(circle,var(--gold),transparent)', opacity:0.04, transform:'translate(30%,-30%)', pointerEvents:'none' }} />

      <div className="container">
        {/* Header */}
        <motion.div className="text-center" style={{ marginBottom:64 }}
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp}>
          <p className="ornamental-border" style={{ fontSize:11, letterSpacing:'0.12em', fontWeight:600, color:'var(--gold)', marginBottom:12 }}>OUR STORY</p>
          <h2 className="font-cormorant section-heading">25+ Years of Cultural Excellence</h2>
          <div className="section-divider" style={{ margin:'12px auto 20px' }} />
          <p className="section-sub" style={{ margin:'0 auto' }}>
            From a humble beginning to a nationally recognised institution — our journey has been one of passion, perseverance, and relentless pursuit of preserving India's rich cultural heritage.
          </p>
        </motion.div>

        {/* Timeline */}
        <div style={{ marginBottom:80, position:'relative' }}>
          <div style={{ display:'none', position:'absolute', top:7, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,var(--gold),transparent)' }}
            className="timeline-line" />
          <style>{`.timeline-line { display: block !important; } @media(max-width:768px){.timeline-line{display:none!important;}}`}</style>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:24 }}>
            {timeline.map((item, i) => (
              <motion.div key={item.year} custom={i}
                initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp}
                style={{ textAlign:'center' }}>
                <div className="timeline-dot" />
                <p className="font-cormorant" style={{ fontWeight:700, fontSize:26, color:'var(--gold)' }}>{item.year}</p>
                <p style={{ fontWeight:600, fontSize:13, color:'var(--deep-green)', margin:'4px 0' }}>{item.title}</p>
                <p style={{ fontSize:12, lineHeight:1.5, color:'var(--text-muted)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Choose Us heading */}
        <motion.div className="text-center" style={{ marginBottom:48 }}
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={2}>
          <p className="ornamental-border" style={{ fontSize:11, letterSpacing:'0.12em', fontWeight:600, color:'var(--gold)', marginBottom:12 }}>WHY CHOOSE US</p>
          <h2 className="font-cormorant section-heading">Why Choose GSM Academy?</h2>
        </motion.div>

        {/* Pillars grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, marginBottom:64 }}>
          {pillars.map((p, i) => (
            <motion.div key={p.title} custom={i}
              initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp}
              className="glass-card card-hover hover-lift"
              style={{ padding:24, borderRadius:20 }}
              whileHover={{ scale:1.02 }}>
              <div style={{ width:48, height:48, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16,
                background:'linear-gradient(135deg,var(--deep-green),var(--deep-green-light))', border:'1px solid var(--border-gold)' }}>
                <i className={`${p.icon}`} style={{ fontSize:22, color:'var(--gold)' }} />
              </div>
              <h3 className="font-cormorant" style={{ fontWeight:700, fontSize:20, color:'var(--deep-green)', marginBottom:8 }}>{p.title}</h3>
              <p style={{ fontSize:13, lineHeight:1.7, color:'var(--text-muted)' }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Platform features dark banner */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={3}
          style={{ borderRadius:28, overflow:'hidden', background:'linear-gradient(135deg,var(--deep-green),var(--deep-green-light))' }}>
          <div style={{ padding:48, display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'center' }}>
            <div>
              <p style={{ fontSize:11, letterSpacing:'0.12em', fontWeight:600, color:'var(--gold)', marginBottom:12 }}>PLATFORM FEATURES</p>
              <h3 className="font-cormorant" style={{ fontWeight:700, fontSize:'2rem', color:'white', marginBottom:16, lineHeight:1.2 }}>
                All-in-One Platform for Cultural Education
              </h3>
              <p style={{ fontSize:13, lineHeight:1.8, color:'rgba(255,255,255,0.7)', marginBottom:24 }}>
                Simplifying management, enhancing learning with our modern digital tools.
              </p>
              <motion.a href="#courses" className="btn-primary"
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 24px', borderRadius:12, fontSize:14, textDecoration:'none' }}
                whileHover={{ scale:1.04 }}>
                Know More About Us <RiArrowRightLine />
              </motion.a>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {features.map((f, i) => (
                <motion.div key={f.label}
                  initial={{ opacity:0, scale:0.85 }} animate={inView ? { opacity:1, scale:1 } : {}}
                  transition={{ delay:0.5+i*0.07 }}
                  style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12,
                    background:'rgba(255,255,255,0.07)', border:'1px solid rgba(201,168,76,0.15)' }}>
                  <i className={f.icon} style={{ fontSize:18, color:'var(--gold)', flexShrink:0 }} />
                  <span style={{ fontSize:12, fontWeight:500, color:'white' }}>{f.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
