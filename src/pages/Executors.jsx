import React, { useState } from 'react'

const executors = [
  { name: 'Wave', version: 'NEW-1.2.1', unc: 'sUNC', price: '$5.99 Weekly', status: 'updated', platform: 'Windows', updated: '4/12/2026' },
  { name: 'Volt', version: '1.2.11', unc: 'sUNC', price: '$5.99 Weekly', status: 'updated', platform: 'Windows', updated: '4/12/2026' },
  { name: 'Potassium', version: '2.1.0', unc: 'sUNC', price: '$22.99 Lifetime', status: 'updated', platform: 'Windows', updated: '4/9/2026' },
  { name: 'Solara', version: '3.0.2', unc: 'UNC', price: 'Free', status: 'updated', platform: 'Windows', updated: '4/11/2026' },
  { name: 'Seliware', version: '1.8.4', unc: 'sUNC', price: '$9.99 Monthly', status: 'not-updated', platform: 'Windows', updated: '4/5/2026' },
  { name: 'Xeno', version: '2.3.1', unc: 'UNC', price: 'Free', status: 'updated', platform: 'Windows / Mac', updated: '4/10/2026' },
  { name: 'Delta', version: '4.1.7', unc: 'pUNC', price: 'Free', status: 'updated', platform: 'Mobile', updated: '4/12/2026' },
  { name: 'Arceus X', version: '3.1.0', unc: 'pUNC', price: 'Free', status: 'not-updated', platform: 'Mobile', updated: '4/8/2026' },
  { name: 'Fluxus', version: '6.9', unc: 'pUNC', price: 'Free', status: 'patched', platform: 'Mobile', updated: '4/1/2026' },
]

const statusMeta = {
  'updated': { label: 'Updated', bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.2)', dot: '#4ade80' },
  'not-updated': { label: 'Not Updated', bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.2)', dot: '#fbbf24' },
  'patched': { label: 'Patched', bg: 'rgba(230,57,70,0.1)', color: 'var(--red)', border: 'rgba(230,57,70,0.2)', dot: 'var(--red)' },
}

export default function Executors() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState('all')

  const filtered = executors.filter(e => {
    if (filter !== 'all' && e.status !== filter) return false
    if (platform !== 'all' && !e.platform.toLowerCase().includes(platform)) return false
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem 4rem', maxWidth: 900, margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .exec-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 1rem 1.25rem;
          background: var(--bg-card);
          border: 1px solid var(--muted2);
          border-radius: 10px;
          transition: border-color 0.2s, background 0.2s;
          animation: fadeUp 0.4s ease both;
        }
        .exec-row:hover {
          border-color: rgba(230,57,70,0.3);
          background: var(--bg-card2);
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 3, height: 24, background: 'var(--red)', borderRadius: 2 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Executors</h1>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Live status tracking for Roblox script executors</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search executors..."
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--muted2)',
            borderRadius: 8, padding: '7px 14px',
            color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.85rem',
            outline: 'none', minWidth: 180,
          }}
        />
        {['all', 'updated', 'not-updated', 'patched'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: 8,
            background: filter === f ? 'rgba(230,57,70,0.12)' : 'var(--bg-card)',
            border: filter === f ? '1px solid rgba(230,57,70,0.3)' : '1px solid var(--muted2)',
            color: filter === f ? '#fff' : 'var(--muted)',
            cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.8rem',
            fontWeight: filter === f ? 600 : 400,
            transition: 'all 0.15s',
            textTransform: 'capitalize',
          }}>{f === 'all' ? 'All' : f.replace('-', ' ')}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {['all', 'windows', 'mobile', 'mac'].map(p => (
            <button key={p} onClick={() => setPlatform(p)} style={{
              padding: '6px 12px', borderRadius: 8,
              background: platform === p ? 'rgba(230,57,70,0.1)' : 'transparent',
              border: '1px solid ' + (platform === p ? 'rgba(230,57,70,0.25)' : 'var(--muted2)'),
              color: platform === p ? '#fff' : 'var(--muted)',
              cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
              transition: 'all 0.15s', textTransform: 'capitalize',
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((ex, i) => {
          const s = statusMeta[ex.status]
          return (
            <div key={ex.name} className="exec-row" style={{ animationDelay: `${i * 0.04}s` }}>
              {/* Color accent */}
              <div style={{ width: 3, height: 36, background: s.dot, borderRadius: 2, flexShrink: 0 }} />

              {/* Name + tags */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{ex.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', background: 'var(--surface)', padding: '2px 6px', borderRadius: 4 }}>{ex.version}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#93c5fd', background: 'rgba(147,197,253,0.08)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(147,197,253,0.12)' }}>{ex.unc}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 3 }}>
                  {ex.platform} · Updated {ex.updated}
                </div>
              </div>

              {/* Price */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: ex.price === 'Free' ? '#4ade80' : '#fbbf24', fontWeight: 500 }}>
                {ex.price}
              </div>

              {/* Status badge */}
              <div style={{
                padding: '4px 12px', borderRadius: 100,
                background: s.bg, color: s.color, border: `1px solid ${s.border}`,
                fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-body)',
                whiteSpace: 'nowrap',
              }}>
                {s.label}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>No executors match your filter.</div>
      )}
    </div>
  )
}
