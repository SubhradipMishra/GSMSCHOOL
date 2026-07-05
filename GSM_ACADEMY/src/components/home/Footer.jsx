import React from 'react'
import { motion } from 'framer-motion'
import { RiMapPinLine, RiPhoneLine, RiMailLine, RiSendPlaneLine, RiGamepadLine } from 'react-icons/ri'

const quickLinks = [
  { label: 'Start Map', href: '/#home' },
  { label: 'Our Story', href: '/#about' },
  { label: 'Skill Trees', href: '/#courses' },
  { label: 'Quests Room', href: '/#events' },
  { label: 'Gallery Logs', href: '/#gallery' },
  { label: 'Guild Masters', href: '/#teachers' },
  { label: 'HQ Contact', href: '/#contact' },
  { label: 'Help FAQs', href: '/#faqs' },
]

const socialLinks = [
  { icon: 'ri-facebook-fill', href: '#', label: 'Facebook' },
  { icon: 'ri-instagram-line', href: '#', label: 'Instagram' },
  { icon: 'ri-youtube-line', href: '#', label: 'YouTube' },
  { icon: 'ri-twitter-x-line', href: '#', label: 'Twitter' },
]

const Footer = () => {
  return (
    <footer id="contact" style={{ background: '#1D2A44', borderTop: '4px solid #FF6F3C', color: '#FDF6E3' }}>
      {/* Top Blinking Led Bar */}
      <div style={{ background: '#FF6F3C', padding: '8px 0', textAlign: 'center', borderBottom: '3px solid #1D2A44' }}>
        <p className="font-pixel" style={{ fontSize: '8px', color: '#1D2A44', margin: 0, letterSpacing: '1px' }}>
          ★ CONGRATULATIONS! YOU CLEARED ALL STAGES ★
        </p>
      </div>

      {/* Main Footer content grid */}
      <div className="container" style={{ padding: '64px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }} className="footer-grid">
        <style>{`
          .footer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; }
          @media(max-width: 1024px) {
            .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media(max-width: 600px) {
            .footer-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* Brand info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            {/* Pixel Logo boundary */}
            <div style={{
              border: '2px solid #FDF6E3',
              padding: '4px',
              background: '#EEDDC2',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <img src="/src/assets/logo.png" alt="GSM Logo" style={{ height: 32, width: 'auto' }} />
            </div>
            <div>
              <p className="font-arcade" style={{ fontWeight: 700, fontSize: '18px', color: '#FF6F3C', margin: 0 }}>GSM ACADEMY</p>
              <p className="font-pixel" style={{ fontSize: '7px', color: '#F5B041', margin: 0, letterSpacing: '0.5px' }}>GAME SAVED</p>
            </div>
          </div>
          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: 24, color: '#CCD1D1' }}>
            Preserving classical heritage, training future generations through Indian arts, traditional values, and structured game-inspired learning dashboard modules.
          </p>
          
          {/* Social connections */}
          <div style={{ display: 'flex', gap: 10 }}>
            {socialLinks.map(s => (
              <motion.a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="arcade-btn"
                style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '6px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: '#EEDDC2', 
                  color: '#1D2A44', 
                  textDecoration: 'none',
                  padding: 0,
                  boxShadow: '2px 2px 0px #FDF6E3'
                }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <i className={s.icon} style={{ fontSize: '14px' }} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Pause Menu Links */}
        <div>
          <p className="font-arcade" style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: 20, color: '#F5B041' }}>LEVEL MAP</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
            {quickLinks.map(l => (
              <li key={l.label}>
                <a 
                  href={l.href} 
                  className="font-arcade"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6, 
                    fontSize: '12px', 
                    color: '#CCD1D1', 
                    textDecoration: 'none', 
                    transition: 'color 0.2s' 
                  }}
                >
                  <span style={{ color: '#FF6F3C' }}>▶</span>
                  {l.label.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Tab */}
        <div>
          <p className="font-arcade" style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: 20, color: '#F5B041' }}>GUILD STATION</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ 
                width: 30, 
                height: 30, 
                borderRadius: '6px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0, 
                background: '#EEDDC2', 
                border: '2px solid #1D2A44',
                color: '#1D2A44'
              }}>
                <RiMapPinLine size={14} />
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#CCD1D1', margin: 0 }}>
                123 Heritage Road, Kolkata – 700 001
              </p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 30, 
                height: 30, 
                borderRadius: '6px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0, 
                background: '#EEDDC2', 
                border: '2px solid #1D2A44',
                color: '#1D2A44'
              }}>
                <RiPhoneLine size={14} />
              </div>
              <a href="tel:+911234567890" style={{ fontSize: '13px', color: '#CCD1D1', textDecoration: 'none' }} className="font-arcade">
                +91 123 456 7890
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 30, 
                height: 30, 
                borderRadius: '6px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0, 
                background: '#EEDDC2', 
                border: '2px solid #1D2A44',
                color: '#1D2A44'
              }}>
                <RiMailLine size={14} />
              </div>
              <a href="mailto:info@gsmacademy.com" style={{ fontSize: '13px', color: '#CCD1D1', textDecoration: 'none' }}>
                info@gsmacademy.com
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Saveprogress form */}
        <div>
          <p className="font-arcade" style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: 8, color: '#F5B041' }}>SAVE SYSTEM PROGRESS</p>
          <p style={{ fontSize: '13px', marginBottom: 20, color: '#CCD1D1' }}>
            Subscribe to save your quest newsletter progress and get event alarms.
          </p>
          
          {/* Save Progress input block */}
          <div style={{ display: 'flex', gap: 6, position: 'relative' }}>
            <input
              type="email"
              placeholder="Enter hero email"
              style={{ 
                flex: 1, 
                padding: '10px 14px', 
                borderRadius: '10px', 
                fontSize: '12px', 
                outline: 'none', 
                background: 'rgba(253, 246, 227, 0.1)', 
                border: '3px solid #FDF6E3', 
                color: '#FDF6E3',
              }}
              className="font-arcade"
            />
            
            <button
              className="arcade-btn btn-secondary"
              style={{ padding: '0 12px', borderRadius: '10px' }}
              id="newsletter-submit"
            >
              <RiSendPlaneLine size={14} />
            </button>
          </div>
          
          <p className="font-pixel" style={{ fontSize: '7px', marginTop: 12, color: '#F5B041', letterSpacing: '0.5px' }}>
            AUTO-SAVE ENABLED. NO SPAM GUARANTEED.
          </p>
        </div>
      </div>

      {/* Copyright bottom strip */}
      <div style={{ borderTop: '3px solid rgba(253, 246, 227, 0.15)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="container" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <p className="font-arcade" style={{ fontSize: '11px', color: '#CCD1D1', margin: 0 }}>
            © 2024 GSM ACADEMY. ALL STAGES CLEAR.
          </p>
          
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service'].map(item => (
              <a key={item} href="#" className="font-arcade" style={{ fontSize: '11px', color: '#CCD1D1', textDecoration: 'none' }}>
                {item.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
