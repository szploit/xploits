import React from 'react'

const externals = [
  { name: 'Anker Games', desc: 'Free PC download website that offers free steam pre-installed games', url: 'https://ankergames.net', tag: 'Cracked' },
  { name: 'ScriptBlox', desc: 'Huge library of free Roblox scripts', url: 'https://scriptblox.com', tag: 'Scripts' },
  { name: 'Pirate Bay Proxy', desc: 'Cracked apps and games for free', url: 'https://piratebayproxy.net/', tag: 'Cracked' },
  { name: 'Cheat Engine', desc: 'Memory scanning and debugging tool used for cheats', url: 'https://www.cheatengine.org/', tag: 'Utility' },
  { name: 'x64dbg', desc: 'User-mode debugger for windows for reverse engineering and malware analysis', url: 'https://x64dbg.com/', tag: 'Utility' },
  { name: 'Process Hacker', desc: 'Advanced task manager tool used for injecting DLLS and monitoring', url: 'https://sourceforge.net/projects/processhacker/', tag: 'Utility' },
]

const tagColors = {
  'Tracker': { bg: 'rgba(147,197,253,0.1)', color: '#93c5fd', border: 'rgba(147,197,253,0.2)' },
  'Scripts': { bg: 'rgba(230,57,70,0.1)', color: '#ff8b8b', border: 'rgba(230,57,70,0.2)' },
  'Versions': { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  'Utility': { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
  'Cracked': { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', border: 'rgba(74,222,128,0.2)' },
}

export default function Externals() {
  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem 4rem', maxWidth: 900, margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ext-card {
          background: var(--bg-card);
          border: 1px solid var(--muted2);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          text-decoration: none;
          display: block;
          color: inherit;
        }
        .ext-card:hover {
          border-color: rgba(230,57,70,0.35);
          background: var(--bg-card2);
          transform: translateY(-2px);
        }
      `}</style>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 3, height: 24, background: 'var(--red)', borderRadius: 2 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Externals</h1>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Useful external tools and resources for Roblox cheating</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {externals.map((ext, i) => {
          const tc = tagColors[ext.tag] || tagColors['Utility']
          return (
            <a key={ext.name} href={ext.url} target="_blank" rel="noopener noreferrer"
              className="ext-card"
              style={{ animation: `fadeUp 0.4s ease both`, animationDelay: `${i * 0.06}s` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{ext.name}</span>
                <span style={{
                  fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                  padding: '2px 8px', borderRadius: 100,
                  background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
                }}>{ext.tag}</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{ext.desc}</p>
              <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>
                Visit →
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
