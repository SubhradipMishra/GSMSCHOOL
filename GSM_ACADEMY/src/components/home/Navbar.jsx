import React, { useState, useEffect, useContext, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiMenuLine, RiCloseLine, RiPhoneLine, RiMailLine } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react'
import Context from '../../util/Context'

const navLinks = [
  { label: 'Start', href: '/#home' },
  { label: 'Story', href: '/#about' },
  { label: 'Skill Tree', href: '/#courses' },
  { label: 'Quests', href: '/#events' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Guild', href: '/#teachers' },
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

  const handleNavClick = (href) => {
    setActive(href);
    setMenuOpen(false);
    if (href.startsWith('/#')) {
      const targetId = href.substring(2);
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <motion.header
      className="nav-fixed"
      style={{
        background: scrolled ? 'rgba(253, 246, 227, 0.95)' : 'rgba(253, 246, 227, 0.8)',
        borderBottom: '4px solid #1D2A44',
        backdropFilter: 'blur(12px)',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Bar - RPG Notification Banner */}
      <div style={{
        background: '#1D2A44',
        borderBottom: '3px solid #FF6F3C',
        color: '#FDF6E3',
        padding: '6px 24px',
        fontSize: '11px',
        display: scrolled ? 'none' : 'block'
      }} className="topbar">
        <style>{`.topbar { display: block; } @media(max-width:768px){.topbar{display:none !important;}}`}</style>
        <div className="container flex-between">
          <div style={{ display: 'flex', gap: 20 }} className="font-arcade">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="ri-sword-line" style={{ color: '#F5B041' }} />
              25+ YEARS OF ACADEMIC LEVELING
            </span>
            <a href="tel:+911234567890" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FDF6E3', textDecoration: 'none' }}>
              <RiPhoneLine size={12} style={{ color: '#FF6F3C' }} /> +91 123 456 7890
            </a>
          </div>
          <div className="font-pixel" style={{ fontSize: '8px', color: '#F5B041', letterSpacing: '1px' }}>
            INSERT COIN TO START LEARNING
          </div>
        </div>
      </div>

      {/* Main Navigation Panel */}
      <nav>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px' }}>
          {/* Logo Frame */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }} onClick={() => window.scrollTo(0, 0)}>
            <motion.div whileHover={{ scale: 1.02 }} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Retro Pixel border around logo */}
              <div style={{
                border: '3px solid #1D2A44',
                padding: '4px',
                background: '#EEDDC2',
                borderRadius: '12px',
                boxShadow: '3px 3px 0px #1D2A44',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img src="/src/assets/logo.png" alt="GSM Logo" style={{ height: 38, width: 'auto' }} />
              </div>
              <div>
                <p className="font-arcade" style={{ color: '#1D2A44', fontWeight: 700, fontSize: '18px', margin: 0, letterSpacing: '0.5px' }}>GSM ACADEMY</p>
                <p className="font-pixel" style={{ color: '#FF6F3C', fontSize: '7px', margin: 0, letterSpacing: '1px' }}>LEVEL SELECTOR</p>
              </div>
            </motion.div>
          </Link>

          {/* Retro Level Menu links */}
          <div className="nav-links" style={{ display: 'flex', gap: 2 }}>
            {navLinks.map(link => {
              const isActive = active === link.href;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="font-arcade"
                  style={{
                    position: 'relative',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: isActive ? '#FF6F3C' : '#1D2A44',
                    background: isActive ? 'rgba(238, 221, 194, 0.5)' : 'transparent',
                    border: isActive ? '3px solid #1D2A44' : '3px solid transparent',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    transform: isActive ? 'translateY(-1px)' : 'none',
                    boxShadow: isActive ? '3px 3px 0px #1D2A44' : 'none'
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.span 
                      layoutId="menu-arrow"
                      style={{ 
                        position: 'absolute', 
                        bottom: '-12px', 
                        left: '50%', 
                        transform: 'translateX(-50%)', 
                        fontSize: '9px',
                        color: '#FF6F3C'
                      }}
                    >
                      ▲
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>

          {/* RPG Status Actions */}
          <div className="nav-ctas" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {session ? (
              <div className="relative" ref={profileRef}>
                {/* Logged In Status Panel */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="arcade-btn"
                  style={{
                    background: '#EEDDC2',
                    padding: '6px 14px',
                    fontSize: '12px',
                    color: '#1D2A44',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    borderRadius: '10px'
                  }}
                >
                  {/* Small Avatar Frame */}
                  <div style={{
                    width: 22,
                    height: 22,
                    borderRadius: '4px',
                    background: '#1D2A44',
                    color: '#F5B041',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    border: '2px solid #FF6F3C'
                  }}>
                    {session.fullname?.substring(0, 2).toUpperCase() || 'P1'}
                  </div>
                  <span className="font-arcade">{session.fullname?.split(" ")[0]}</span>
                  <ChevronDown size={14} style={{ transform: profileOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="arcade-card"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: 12,
                        width: 240,
                        padding: '16px',
                        zIndex: 100,
                        boxShadow: '6px 6px 0px #1D2A44'
                      }}
                    >
                      <div style={{ borderBottom: '3px dashed #1D2A44', paddingBottom: 12, marginBottom: 12 }}>
                        <p className="font-arcade" style={{ color: '#1D2A44', fontSize: '14px', fontWeight: 700, margin: 0 }}>{session.fullname}</p>
                        <p style={{ color: '#5D6D7E', fontSize: '11px', margin: 0, wordBreak: 'break-all' }}>{session.email}</p>
                        
                        {/* XP bar display */}
                        <div style={{ marginTop: 8 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 'bold', color: '#FF6F3C' }} className="font-pixel">
                            <span>LVL 1 ACTIVE</span>
                            <span>80% XP</span>
                          </div>
                          <div className="pixel-progress" style={{ height: 10, marginTop: 4 }}>
                            <div className="pixel-progress-fill" style={{ width: '80%', background: '#F5B041' }}></div>
                          </div>
                        </div>
                      </div>

                      <Link to={getDashboardLink(session.role)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', textDecoration: 'none', color: '#1D2A44', borderRadius: '8px', background: 'rgba(245, 176, 65, 0.15)', border: '2px solid #1D2A44', marginBottom: 8 }} className="font-arcade">
                        <LayoutDashboard size={14} />
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Dashboard</span>
                      </Link>
                      
                      <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', border: '2px solid #1D2A44', background: '#FF6F3C', color: '#FDF6E3', cursor: 'pointer', borderRadius: '8px' }} className="font-arcade">
                        <LogOut size={14} />
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Power Off</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button className="arcade-btn btn-outline" style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '10px' }}>
                    Coin [IN]
                  </button>
                </Link>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <button className="arcade-btn btn-primary" style={{ padding: '6px 16px', fontSize: '12px', borderRadius: '10px' }}>
                    1P START
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger menu for mobile */}
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: '#1D2A44', cursor: 'pointer' }}>
            {menuOpen ? <RiCloseLine size={28} /> : <RiMenuLine size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: '#FDF6E3',
                borderTop: '3px solid #1D2A44',
                borderBottom: '4px solid #1D2A44',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {navLinks.map((link, i) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className="font-arcade"
                    style={{
                      padding: '10px 12px',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#1D2A44',
                      background: 'none',
                      border: 'none',
                      borderBottom: '2px dashed rgba(29, 42, 68, 0.15)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    {link.label}
                  </button>
                ))}
                
                <div style={{ display: 'flex', gap: 12, paddingTop: 12 }}>
                  {session ? (
                    <>
                      <Link to={getDashboardLink(session.role)} style={{ flex: 1, textDecoration: 'none' }}>
                        <button className="arcade-btn btn-outline" style={{ width: '100%', padding: '8px 0', fontSize: '12px' }}>Dashboard</button>
                      </Link>
                      <button onClick={handleLogout} className="arcade-btn btn-primary" style={{ flex: 1, padding: '8px 0', fontSize: '12px' }}>Power Off</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" style={{ flex: 1, textDecoration: 'none' }}>
                        <button className="arcade-btn btn-outline" style={{ width: '100%', padding: '8px 0', fontSize: '12px' }}>Coin [IN]</button>
                      </Link>
                      <Link to="/signup" style={{ flex: 1, textDecoration: 'none' }}>
                        <button className="arcade-btn btn-primary" style={{ width: '100%', padding: '8px 0', fontSize: '12px' }}>1P START</button>
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
