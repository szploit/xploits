import React, { useState } from 'react'

const CHANNELS = ['LIVE', 'ZLIVE', 'ZNext', 'ZCanary']
const BINARY_TYPES = [
  { value: 'WindowsPlayer', label: 'Windows Player' },
  { value: 'WindowsStudio64', label: 'Windows Studio' },
  { value: 'MacPlayer', label: 'Mac Player' },
  { value: 'MacStudio', label: 'Mac Studio' },
]

export default function RDD() {
  const [version, setVersion] = useState('')
  const [channel, setChannel] = useState('LIVE')
  const [binaryType, setBinaryType] = useState('WindowsPlayer')
  const [error, setError] = useState('')

  const isValid = version.trim().startsWith('version-') && version.trim().length > 10

  const handleDownload = () => {
    const v = version.trim()
    if (!v) { setError('Please enter a version hash.'); return }
    if (!v.startsWith('version-')) { setError('Version must start with "version-" e.g. version-26c90be22e0d4758'); return }
    setError('')
    const url = `https://rdd.latte.to/?channel=${channel}&binaryType=${binaryType}&version=${encodeURIComponent(v)}`
    window.open(url, '_blank')
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setVersion(text.trim())
      setError('')
    } catch {
      setError('Could not read clipboard.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem 4rem', maxWidth: 700, margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .option-btn { cursor:pointer; border-radius:8px; font-family:var(--font-body); font-size:0.82rem; transition:all 0.15s; }
        .option-btn:hover { border-color:rgba(230,57,70,0.4) !important; color:#fff !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem', animation: 'fadeUp 0.4s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 3, height: 24, background: 'var(--red)', borderRadius: 2 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>RDD</h1>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)', background: 'var(--bg-card)', border: '1px solid var(--muted2)', padding: '2px 8px', borderRadius: 4 }}>via Latte</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Download any specific Roblox version by hash</p>
      </div>

      {/* Main card */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--muted2)', borderRadius: 14, padding: '2rem', animation: 'fadeUp 0.4s ease both', animationDelay: '0.08s' }}>

        {/* Version input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 8, fontWeight: 500 }}>
            Version Hash
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={version}
              onChange={e => { setVersion(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleDownload()}
              placeholder="version-26c90be22e0d4758"
              spellCheck={false}
              style={{
                flex: 1, background: 'var(--bg)', border: '1px solid var(--muted2)',
                borderRadius: 8, padding: '10px 14px',
                color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(230,57,70,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--muted2)'}
            />
            <button onClick={handlePaste} title="Paste from clipboard" style={{
              padding: '10px 14px', borderRadius: 8,
              background: 'var(--bg)', border: '1px solid var(--muted2)',
              color: 'var(--muted)', cursor: 'pointer', fontSize: '0.85rem',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(230,57,70,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--muted2)' }}
            >📋</button>
          </div>
          {error && <p style={{ color: 'var(--red)', fontSize: '0.78rem', marginTop: 6, fontFamily: 'var(--font-mono)' }}>{error}</p>}
          {isValid && !error && (
            <p style={{ color: '#4ade80', fontSize: '0.78rem', marginTop: 6, fontFamily: 'var(--font-mono)' }}>✓ Valid version hash</p>
          )}
        </div>

        {/* Channel */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 8, fontWeight: 500 }}>
            Channel
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CHANNELS.map(c => (
              <button key={c} onClick={() => setChannel(c)} className="option-btn" style={{
                padding: '7px 16px',
                background: channel === c ? 'rgba(230,57,70,0.12)' : 'var(--bg)',
                border: channel === c ? '1px solid rgba(230,57,70,0.35)' : '1px solid var(--muted2)',
                color: channel === c ? '#fff' : 'var(--muted)',
                fontWeight: channel === c ? 600 : 400,
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Binary type */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 8, fontWeight: 500 }}>
            Binary Type
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {BINARY_TYPES.map(bt => (
              <button key={bt.value} onClick={() => setBinaryType(bt.value)} className="option-btn" style={{
                padding: '7px 16px',
                background: binaryType === bt.value ? 'rgba(230,57,70,0.12)' : 'var(--bg)',
                border: binaryType === bt.value ? '1px solid rgba(230,57,70,0.35)' : '1px solid var(--muted2)',
                color: binaryType === bt.value ? '#fff' : 'var(--muted)',
                fontWeight: binaryType === bt.value ? 600 : 400,
              }}>{bt.label}</button>
            ))}
          </div>
        </div>

        {/* Generated URL preview */}
        {version.trim() && (
          <div style={{ marginBottom: '1.5rem', padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--muted2)', borderRadius: 8 }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 4, fontFamily: 'var(--font-body)' }}>Download URL</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#93c5fd', wordBreak: 'break-all', lineHeight: 1.6 }}>
              {`https://rdd.latte.to/?channel=${channel}&binaryType=${binaryType}&version=${version.trim()}`}
            </p>
          </div>
        )}

        {/* Download button */}
        <button onClick={handleDownload} style={{
          width: '100%', padding: '13px', borderRadius: 10,
          background: isValid ? 'var(--red)' : 'var(--surface)',
          color: isValid ? '#fff' : 'var(--muted)',
          border: 'none', cursor: isValid ? 'pointer' : 'not-allowed',
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
          letterSpacing: '-0.01em',
          transition: 'all 0.2s',
          boxShadow: isValid ? '0 0 24px rgba(230,57,70,0.25)' : 'none',
        }}
          onMouseEnter={e => { if (isValid) { e.currentTarget.style.background = 'var(--red-dim)'; e.currentTarget.style.boxShadow = '0 0 36px rgba(230,57,70,0.4)' } }}
          onMouseLeave={e => { if (isValid) { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(230,57,70,0.25)' } }}
        >
          Download via Latte →
        </button>
      </div>

      {/* Info box */}
      <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(147,197,253,0.05)', border: '1px solid rgba(147,197,253,0.12)', borderRadius: 10, animation: 'fadeUp 0.4s ease both', animationDelay: '0.16s' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.7 }}>
          <span style={{ color: '#93c5fd', fontWeight: 600 }}>How to find your version hash</span><br />
          Check the <a href="/executors" style={{ color: 'var(--red)', textDecoration: 'none' }}>Executors page</a> for current version hashes, or grab them from <a href="https://whatexpsare.online" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', textDecoration: 'none' }}>WhatExpsAre.Online</a>. Downloads are handled by <a href="https://latte.to" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', textDecoration: 'none' }}>Latte</a>.
        </p>
      </div>
    </div>
  )
}
