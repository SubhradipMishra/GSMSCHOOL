import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RiArrowRightLine, RiCalendarLine } from 'react-icons/ri'

const badges = [
  { icon: 'ri-award-line', label: 'Authentic Curriculum' },
  { icon: 'ri-user-star-line', label: 'Expert Teachers' },
  { icon: 'ri-seedling-line', label: 'Holistic Development' },
  { icon: 'ri-heart-line', label: 'Value Based Education' },
]

const Hero = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCount(p => p < 25 ? p + 1 : p), 80)
    return () => clearInterval(t)
  }, [])

  return (
    <section id="home" style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', overflow:'hidden' }}>
      {/* BG */}
      <div className="hero-gradient" style={{ position:'absolute', inset:0 }} />
      <div className="pattern-bg" style={{ position:'absolute', inset:0, opacity:0.3 }} />
      <div style={{ position:'absolute', top:'-8rem', right:'-8rem', width:384, height:384, borderRadius:'50%', background:'radial-gradient(circle, var(--gold), transparent)', opacity:0.07, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-5rem', left:'-5rem', width:288, height:288, borderRadius:'50%', background:'radial-gradient(circle, var(--gold), transparent)', opacity:0.07, pointerEvents:'none' }} />

      {/* OM watermark */}
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', pointerEvents:'none' }}>
        <span className="font-cormorant" style={{ fontSize:'22rem', color:'rgba(201,168,76,0.04)', lineHeight:1, userSelect:'none' }}>ॐ</span>
      </div>

      <div className="container" style={{ position:'relative', zIndex:10, paddingTop:160, paddingBottom:80 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>

          {/* ── Left ── */}
          <div>
            {/* Tag */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:999,
                background:'rgba(201,168,76,0.12)', border:'1px solid var(--border-gold)', color:'var(--gold)',
                fontSize:11, fontWeight:600, letterSpacing:'0.12em', marginBottom:24 }}>
              <span className="pulse-gold" style={{ width:8, height:8, borderRadius:'50%', background:'var(--gold)', display:'inline-block' }} />
              INDIA'S PREMIER CULTURAL ACADEMY
            </motion.div>

            {/* Headline */}
            <motion.h1 className="font-cormorant" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              style={{ fontWeight:700, lineHeight:1.1, marginBottom:16, color:'white', fontSize:'clamp(2.4rem,5vw,4.2rem)' }}>
              Preserving Heritage.
              <br /><span className="gold-text">Building Future</span>
              <br />Generations.
            </motion.h1>

            {/* Sub */}
            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              style={{ fontSize:15, lineHeight:1.8, marginBottom:32, maxWidth:480, color:'rgba(255,255,255,0.72)' }}>
              GSM Academy is a cultural school dedicated to preserving India's rich heritage through classical arts, traditional knowledge and value-based education.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              style={{ display:'flex', flexWrap:'wrap', gap:16, marginBottom:48 }}>
              <motion.a href="#courses" className="btn-primary"
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 24px', borderRadius:12, fontSize:14, textDecoration:'none' }}
                whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
                Explore Courses <RiArrowRightLine size={18} />
              </motion.a>
              <motion.a href="#about" className="btn-outline"
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 24px', borderRadius:12, fontSize:14, textDecoration:'none' }}
                whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
                <RiCalendarLine size={16} /> Book a Visit
              </motion.a>
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.45 }}
              style={{ display:'flex', flexWrap:'wrap', gap:32, marginBottom:36 }}>
              {[{ v: count + '+', l:'Years of Excellence' },{ v:'10K+', l:'Students Trained' },
                { v:'50+', l:'Expert Teachers' },{ v:'12+', l:'Art Forms' }].map(s => (
                <div key={s.l}>
                  <p className="font-cormorant" style={{ fontWeight:700, fontSize:'1.9rem', color:'var(--gold)' }}>{s.v}</p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.58)' }}>{s.l}</p>
                </div>
              ))}
            </motion.div>

            {/* Badges */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8, delay:0.6 }}
              style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
              {badges.map((b, i) => (
                <motion.div key={b.label}
                  initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.6+i*0.1 }}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', borderRadius:8, fontSize:12,
                    background:'rgba(255,255,255,0.07)', border:'1px solid rgba(201,168,76,0.14)', color:'rgba(255,255,255,0.75)' }}>
                  <i className={b.icon} style={{ color:'var(--gold)' }} />
                  {b.label}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right visual ── */}
          <motion.div initial={{ opacity:0, x:50 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.9, delay:0.3 }}
            style={{ position:'relative' }}>
            <div style={{ position:'absolute', inset:0, borderRadius:24, background:'linear-gradient(135deg,var(--gold),var(--deep-green))', filter:'blur(60px)', opacity:0.15 }} />
            <div style={{ position:'relative', borderRadius:24, overflow:'hidden', border:'1px solid var(--border-gold)' }}>
              <div style={{ width:'100%', height:500, display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
                background:'linear-gradient(135deg,rgba(26,58,42,0.8),rgba(45,89,64,0.6))' }}>
                {/* Rings */}
                <div style={{ position:'absolute', width:320, height:320, borderRadius:'50%', border:'2px solid var(--gold)', opacity:0.1 }} />
                <div style={{ position:'absolute', width:240, height:240, borderRadius:'50%', border:'1px solid var(--gold)', opacity:0.15, transform:'rotate(45deg)' }} />

                {/* Center icon */}
                <div style={{ textAlign:'center', position:'relative', zIndex:2 }}>
                  <div style={{ width:120, height:120, margin:'0 auto 16px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                    background:'rgba(201,168,76,0.1)', border:'1px solid var(--border-gold)' }}>
                    <i className="ri-music-2-line" style={{ fontSize:48, color:'var(--gold)' }} />
                  </div>
                  <p className="font-cormorant" style={{ fontWeight:600, fontSize:22, color:'var(--gold)' }}>Classical Arts</p>
                  <p style={{ fontSize:13, marginTop:6, color:'rgba(255,255,255,0.58)' }}>Bharatanatyam • Kathak • Tabla</p>
                </div>

                {/* Floating card – Live */}
                <motion.div className="glass-card"
                  style={{ position:'absolute', top:20, left:20, padding:'10px 14px', borderRadius:12 }}
                  animate={{ y:[0,-8,0] }} transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}>
                  <p style={{ fontSize:11, fontWeight:600, color:'var(--deep-green)' }}>🎭 Live Classes</p>
                  <p style={{ fontSize:22, fontWeight:700, color:'var(--gold)' }} className="font-cormorant">4 Today</p>
                </motion.div>

                {/* Floating card – Event */}
                <motion.div className="glass-card"
                  style={{ position:'absolute', bottom:20, right:20, padding:'10px 14px', borderRadius:12 }}
                  animate={{ y:[0,8,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}>
                  <p style={{ fontSize:11, fontWeight:600, color:'var(--deep-green)' }}>🏆 Next Event</p>
                  <p style={{ fontSize:14, fontWeight:700, color:'var(--gold-dark)' }} className="font-cormorant">Spring Utsav</p>
                  <p style={{ fontSize:11, color:'var(--text-muted)' }}>May 25, 2025</p>
                </motion.div>

                {/* Spin star */}
                <motion.div
                  style={{ position:'absolute', top:20, right:20, width:52, height:52, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                    background:'rgba(201,168,76,0.12)', border:'1px solid var(--border-gold)' }}
                  animate={{ rotate:360 }} transition={{ duration:20, repeat:Infinity, ease:'linear' }}>
                  <i className="ri-star-line" style={{ fontSize:20, color:'var(--gold)' }} />
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}
        animate={{ y:[0,8,0] }} transition={{ duration:2, repeat:Infinity }}>
        <p style={{ fontSize:10, letterSpacing:'0.15em', color:'rgba(201,168,76,0.6)' }}>SCROLL DOWN</p>
        <div style={{ width:1, height:32, background:'linear-gradient(180deg,var(--gold),transparent)' }} />
      </motion.div>
    </section>
  )
}

export default Hero
