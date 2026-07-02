import React from 'react'
import { motion } from 'framer-motion'
import { RiMapPinLine, RiPhoneLine, RiMailLine, RiSendPlaneLine } from 'react-icons/ri'

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Courses', href: '#courses' },
  { label: 'Events', href: '#events' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Teachers', href: '#teachers' },
  { label: 'Contact', href: '#contact' },
  { label: 'FAQs', href: '#faqs' },
]

const socialLinks = [
  { icon: 'ri-facebook-fill', href: '#', label: 'Facebook' },
  { icon: 'ri-instagram-line', href: '#', label: 'Instagram' },
  { icon: 'ri-youtube-line', href: '#', label: 'YouTube' },
  { icon: 'ri-twitter-x-line', href: '#', label: 'Twitter' },
]

const Footer = () => {
  return (
    <footer id="contact" style={{ background: 'var(--deep-green)' }}>
      {/* Main Footer */}
      <div className="container" style={{ padding: '64px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40 }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <img src="/src/assets/logo.png" alt="GSM Logo" style={{ height: 40, width: 'auto' }} />
            <div>
              <p className="font-cormorant" style={{ fontWeight: 700, fontSize: 18, color: 'var(--gold)' }}>GSM ACADEMY</p>
              <p style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(201,168,76,0.5)' }}>CULTURAL EXCELLENCE</p>
            </div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 24, color: 'rgba(255,255,255,0.55)' }}>
            Preserving Heritage, Building Future Generations through classical arts, cultural celebration and value-based education.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {socialLinks.map(s => (
              <motion.a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}
                whileHover={{ scale: 1.15, background: 'rgba(201,168,76,0.2)', color: 'var(--gold)' }}
              >
                <i className={s.icon} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p className="font-cormorant" style={{ fontWeight: 600, fontSize: 18, marginBottom: 20, color: 'var(--gold)' }}>Quick Links</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {quickLinks.map(l => (
              <li key={l.label}>
                <a href={l.href} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)', opacity: 0.5 }} />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="font-cormorant" style={{ fontWeight: 600, fontSize: 18, marginBottom: 20, color: 'var(--gold)' }}>Contact Info</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <RiMapPinLine size={14} style={{ color: 'var(--gold)' }} />
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
                123 Heritage Road, Kolkata – 700 001
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <RiPhoneLine size={14} style={{ color: 'var(--gold)' }} />
              </div>
              <a href="tel:+911234567890" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                +91 123 456 7890
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <RiMailLine size={14} style={{ color: 'var(--gold)' }} />
              </div>
              <a href="mailto:info@gsmacademy.com" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>
                info@gsmacademy.com
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <p className="font-cormorant" style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, color: 'var(--gold)' }}>Newsletter</p>
          <p style={{ fontSize: 14, marginBottom: 20, color: 'rgba(255,255,255,0.55)' }}>
            Stay updated with our latest events and courses.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{ flex: 1, padding: '10px 16px', borderRadius: 12, fontSize: 14, outline: 'none', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,168,76,0.2)', color: 'rgba(255,255,255,0.8)' }}
            />
            <motion.button
              className="btn-primary"
              style={{ padding: '10px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              id="newsletter-submit"
            >
              <RiSendPlaneLine size={16} />
            </motion.button>
          </div>
          <p style={{ fontSize: 12, marginTop: 12, color: 'rgba(255,255,255,0.35)' }}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="container" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            © 2024 GSM Academy. All Rights Reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Use'].map(item => (
              <a key={item} href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
