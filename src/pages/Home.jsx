import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function GlowOrb({ x, y, size, color, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width: size, height: size,
      borderRadius: '50%',
      background: color,
      opacity,
      filter: `blur(${size / 2}px)`,
      pointerEvents: 'none',
    }} />
  )
}

function StatCard({ value, label }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--muted2)',
      borderRadius: 12,
      padding: '1.25rem 1.75rem',
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--red)', lineHeight: 1 }}>{value}</div>
      <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: 6, fontWeight: 400 }}>{label}</div>
    </div>
  )
}

export default function Home() {
  const heroRef = useRef()

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const move = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.setProperty('--mx', x)
      el.style.setProperty('--my', y)
    }
    el.addEventListener('mousemove', move)
    return () => el.removeEventListener('mousemove', move)
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <section ref={heroRef} style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '6rem 2rem 4rem',
        overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <GlowOrb x="10%" y="15%" size={500} color="#e63946" opacity={0.055} />
        <GlowOrb x="60%" y="60%" size={400} color="#c1121f" opacity={0.04} />
        <GlowOrb x="80%" y="5%" size={300} color="#e63946" opacity={0.03} />

        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(230,57,70,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(230,57,70,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
        }} />

        {/* Status badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(230,57,70,0.08)',
          border: '1px solid rgba(230,57,70,0.2)',
          borderRadius: 100,
          padding: '5px 14px',
          marginBottom: '2rem',
          fontSize: '0.75rem',
          color: '#ff8b8b',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.05em',
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#4ade80',
            boxShadow: '0 0 6px #4ade80',
            animation: 'pulse 2s infinite',
          }} />
          LIVE TRACKING ACTIVE
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 9vw, 7.5rem)',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          marginBottom: '1rem',
          animation: 'fadeUp 0.6s ease both',
          animationDelay: '0.1s',
        }}>
          <span style={{ color: '#fff' }}>Xploits</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: 'var(--muted)',
          maxWidth: 520,
          lineHeight: 1.7,
          marginBottom: '2.5rem',
          fontWeight: 300,
          animation: 'fadeUp 0.6s ease both',
          animationDelay: '0.2s',
        }}>
          Roblox exploit tracker, and useful tools.<br />
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
          animation: 'fadeUp 0.6s ease both',
          animationDelay: '0.3s',
        }}>
          <Link to="/executors" style={{
            textDecoration: 'none',
            padding: '12px 28px',
            borderRadius: 10,
            background: 'var(--red)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.9rem',
            fontFamily: 'var(--font-body)',
            transition: 'all 0.2s',
            boxShadow: '0 0 24px rgba(230,57,70,0.3)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-dim)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(230,57,70,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(230,57,70,0.3)' }}
          >
            View Executors
          </Link>
          <a href="https://discord.gg/4hseHSkCEE" target="_blank" rel="noopener noreferrer" style={{
            textDecoration: 'none',
            padding: '12px 28px',
            borderRadius: 10,
            background: 'transparent',
            color: '#fff',
            fontWeight: 500,
            fontSize: '0.9rem',
            fontFamily: 'var(--font-body)',
            border: '1px solid var(--muted2)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(230,57,70,0.4)'; e.currentTarget.style.background = 'rgba(230,57,70,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--muted2)'; e.currentTarget.style.background = 'transparent' }}
          >
            Join Discord
          </a>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 12, marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center',
          animation: 'fadeUp 0.6s ease both',
          animationDelay: '0.45s',
        }}>
          <StatCard value="12+" label="Executors tracked" />
          <StatCard value="Live" label="Status updates" />
          <StatCard value="Free" label="Always" />
        </div>
      </section>
    </div>
  )
}
