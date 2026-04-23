import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/executors', label: 'Executors' },
  { to: '/externals', label: 'Externals' },
  { to: '/tools', label: 'Tools' },
  { to: '/rdd', label: 'RDD' },
  { to: '/tutorials', label: 'Tutorials' },
  { to: '/games', label: 'Games' },
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
      padding: '0 1.5rem', height: '64px',
      background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(230,57,70,0.1)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <img src="./X.png" alt="Xploits" style={{ width: 28, height: 28, borderRadius: 6 }} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.03em' }}>xploits</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', overflow: 'auto' }}>
        {links.map(({ to, label }) => {
          const active = location.pathname === to
          return (
            <Link key={to} to={to} style={{
              textDecoration: 'none', padding: '6px 10px', borderRadius: 8,
              fontFamily: 'var(--font-body)', fontWeight: active ? 600 : 400, fontSize: '0.8rem',
              color: active ? '#fff' : 'var(--muted)',
              background: active ? 'rgba(230,57,70,0.12)' : 'transparent',
              border: active ? '1px solid rgba(230,57,70,0.25)' : '1px solid transparent',
              transition: 'all 0.2s ease', position: 'relative', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--muted)' }}
            >
              {label}
              {active && <span style={{ position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)', width: 16, height: 2, background: 'var(--red)', borderRadius: 2 }} />}
            </Link>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <a href="https://github.com/szploit/xploits/releases/download/V1.0.0/Xploits.exe" target="_blank" rel="noopener noreferrer" style={{
          textDecoration: 'none', padding: '7px 14px', borderRadius: 8,
          background: 'transparent', color: '#fff', fontFamily: 'var(--font-body)',
          fontWeight: 600, fontSize: '0.82rem',
          border: '1px solid var(--muted2)',
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(230,57,70,0.4)'; e.currentTarget.style.background = 'rgba(230,57,70,0.06)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--muted2)'; e.currentTarget.style.background = 'transparent' }}
        >⬇ Download</a>
        <a href="https://discord.gg/jeyCcaC3" target="_blank" rel="noopener noreferrer" style={{
          textDecoration: 'none', padding: '7px 14px', borderRadius: 8,
          background: 'var(--red)', color: '#fff', fontFamily: 'var(--font-body)',
          fontWeight: 600, fontSize: '0.82rem', border: 'none', cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dim)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
        >Discord</a>
      </div>
    </nav>
  )
}
