import React, { useState, useEffect, useContext, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiMenuLine, RiCloseLine, RiPhoneLine, RiMailLine } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import Context from '../../util/Context'

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Courses', href: '/#courses' },
  { label: 'Events', href: '/#events' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Teachers', href: '/#teachers' },
  { label: 'Contact', href: '/#contact' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('/#home')
  const [profileOpen, setProfileOpen] = useState(false)
  
  const { session, setSession } = useContext(Context)
  const profileRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const getDashboardLink = (role) => {
    if (role === "admin") return "/admin/dashboard"
    if (role === "teacher") return "/teacher/dashboard"
    return "/student/dashboard"
  }

  const handleLogout = () => {
    setSession(null)
    setProfileOpen(false)
    navigate('/')
  }

  return (
    <motion.header
      className={`nav-fixed ${scrolled ? 'nav-scrolled' : ''}`}
      style={{
        background: scrolled ? 'rgba(26,58,42,0.98)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.1)' : 'none',
      }}
      initial={{ y: -100 }} animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Top bar */}
      <div style={{
        background: 'var(--deep-green)',
        display: scrolled ? 'none' : 'block',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }} className="topbar">
        <style>{`.topbar { display: block; } @media(max-width:768px){.topbar{display:none !important;}}`}</style>
        <div className="container flex-between" style={{ padding: '8px 24px' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {[{ icon: <RiPhoneLine size={13}/>, text: '+91 123 456 7890', href: 'tel:+911234567890' },
              { icon: <RiMailLine size={13}/>, text: 'info@gsmacademy.com', href: 'mailto:info@gsmacademy.com' }]
              .map(item => (
              <a key={item.text} href={item.href}
                style={{ display:'flex', alignItems:'center', gap:6, color:'rgba(201,168,76,0.8)', fontSize:12, textDecoration:'none' }}>
                {item.icon} {item.text}
              </a>
            ))}
          </div>
          <p style={{ color:'rgba(201,168,76,0.7)', fontSize:12 }}>25+ Years of Cultural Excellence</p>
        </div>
      </div>

      {/* Main Nav */}
      <nav>
        <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px' }}>
          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none' }} onClick={() => window.scrollTo(0, 0)}>
            <motion.div whileHover={{ scale: 1.02 }} style={{ display:'flex', alignItems:'center', gap:12 }}>
              <img src="/src/assets/logo.png" alt="GSM Logo" style={{ height: 44, width: 'auto' }} />
              <div>
                <p className="font-cormorant" style={{ color:'var(--gold)', fontWeight:700, fontSize:18, lineHeight:1 }}>GSM ACADEMY</p>
                <p style={{ color:'rgba(201,168,76,0.6)', fontSize:10, letterSpacing:'0.15em' }}>CULTURAL EXCELLENCE</p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop links */}
          <div className="nav-links" style={{ display:'flex', gap:4 }}>
            {navLinks.map(link => (
              <a
                key={link.label} href={link.href}
                onClick={() => setActive(link.href)}
                style={{
                  position:'relative', padding:'8px 12px', fontSize:14, fontWeight:500,
                  color: active === link.href ? 'var(--gold)' : 'rgba(255,255,255,0.85)',
                  textDecoration:'none', transition:'color 0.2s'
                }}
              >
                {link.label}
                {active === link.href && (
                  <motion.span layoutId="ul"
                    style={{ position:'absolute', bottom:0, left:8, right:8, height:2, borderRadius:1, background:'var(--gold)' }} />
                )}
              </a>
            ))}
          </div>

          {/* CTA & Profile */}
          <div className="nav-ctas" style={{ display:'flex', gap:12, alignItems: 'center' }}>
            {session ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold)', background: 'transparent', border: '1px solid var(--border-gold)', padding: '8px 16px', borderRadius: 10, cursor: 'pointer' }}
                >
                  <User size={16} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{session.fullname?.split(" ")[0] || "Profile"}</span>
                  <ChevronDown size={14} style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      style={{ position: 'absolute', top: '100%', right: 0, marginTop: 12, background: 'var(--cream)', borderRadius: 12, overflow: 'hidden', minWidth: 200, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 100 }}
                    >
                      <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <p style={{ color: 'var(--ink)', fontSize: 14, fontWeight: 700, margin: 0 }}>{session.fullname}</p>
                        <p style={{ color: 'var(--ink-soft)', fontSize: 12, margin: 0 }}>{session.email}</p>
                      </div>
                      <Link to={getDashboardLink(session.role)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', textDecoration: 'none', color: 'var(--ink)' }}>
                        <LayoutDashboard size={16} /> <span style={{ fontSize: 13, fontWeight: 500 }}>Dashboard</span>
                      </Link>
                      <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', border: 'none', background: 'transparent', color: '#e53e3e', cursor: 'pointer', textAlign: 'left' }}>
                        <LogOut size={16} /> <span style={{ fontSize: 13, fontWeight: 500 }}>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <motion.button className="btn-outline" style={{ padding:'8px 18px', borderRadius:10, fontSize:13 }}
                    whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>Login</motion.button>
                </Link>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <motion.button className="btn-primary" style={{ padding:'8px 20px', borderRadius:10, fontSize:13 }}
                    whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>Enroll Now</motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}
            style={{ background:'none', border:'none', color:'var(--gold)', cursor:'pointer' }}>
            {menuOpen ? <RiCloseLine size={28}/> : <RiMenuLine size={28}/>}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
              style={{ background:'rgba(26,58,42,0.98)', borderTop:'1px solid var(--border-gold)', overflow: 'hidden' }}
            >
              <div style={{ padding:'16px 24px', display:'flex', flexDirection:'column', gap:4 }}>
                {navLinks.map((link, i) => (
                  <a key={link.label} href={link.href}
                    onClick={() => { setActive(link.href); setMenuOpen(false) }}
                    style={{ padding:'12px 0', fontSize:14, fontWeight:500, color:'rgba(255,255,255,0.85)',
                      textDecoration:'none', borderBottom:'1px solid var(--border-gold)' }}>
                    {link.label}
                  </a>
                ))}
                
                <div style={{ display:'flex', gap:12, paddingTop:16 }}>
                  {session ? (
                    <>
                      <Link to={getDashboardLink(session.role)} style={{ flex:1, textDecoration: 'none' }}>
                        <button className="btn-outline" style={{ width: '100%', padding:'9px 0', borderRadius:10, fontSize:13 }}>Dashboard</button>
                      </Link>
                      <button onClick={handleLogout} className="btn-primary" style={{ flex:1, padding:'9px 0', borderRadius:10, fontSize:13 }}>Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" style={{ flex:1, textDecoration: 'none' }}>
                        <button className="btn-outline" style={{ width: '100%', padding:'9px 0', borderRadius:10, fontSize:13 }}>Login</button>
                      </Link>
                      <Link to="/signup" style={{ flex:1, textDecoration: 'none' }}>
                        <button className="btn-primary" style={{ width: '100%', padding:'9px 0', borderRadius:10, fontSize:13 }}>Enroll Now</button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

export default Navbar
