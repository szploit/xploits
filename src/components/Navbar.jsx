import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/executors', label: 'Executors' },
  { to: '/externals', label: 'Externals' },
  { to: '/tools', label: 'Tools' },
  { to: '/rdd', label: 'RDD' },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 2rem', height: '64px',
      background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(230,57,70,0.1)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: 28, height: 28, background: 'var(--red)', borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: '#fff', letterSpacing: '-0.5px',
        }}>X</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.03em' }}>xploits</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {links.map(({ to, label }) => {
          const active = location.pathname === to
          return (
            <Link key={to} to={to} style={{
              textDecoration: 'none', padding: '6px 14px', borderRadius: 8,
              fontFamily: 'var(--font-body)', fontWeight: active ? 600 : 400, fontSize: '0.875rem',
              color: active ? '#fff' : 'var(--muted)',
              background: active ? 'rgba(230,57,70,0.12)' : 'transparent',
              border: active ? '1px solid rgba(230,57,70,0.25)' : '1px solid transparent',
              transition: 'all 0.2s ease', position: 'relative',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--muted)' }}
            >
              {label}
              {active && <span style={{ position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: 'var(--red)', borderRadius: 2 }} />}
            </Link>
          )
        })}
      </div>

      <a href="https://discord.gg/" target="_blank" rel="noopener noreferrer" style={{
        textDecoration: 'none', padding: '7px 18px', borderRadius: 8,
        background: 'var(--red)', color: '#fff', fontFamily: 'var(--font-body)',
        fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer',
        transition: 'all 0.2s ease', letterSpacing: '0.01em',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dim)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
      >Discord</a>
    </nav>
  )
}
