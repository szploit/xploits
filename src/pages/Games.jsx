import React from 'react'

const games = [
  {
    name: 'Geometry Dash',
    version: '2.2',
    description: 'The classic rhythm-based platformer. Jump, fly and flip your way through dangerous passages and spiky obstacles.',
    tags: ['Platformer', 'Rhythm', 'Cracked'],
    size: 'varies',
    download: 'https://github.com/szploit/cracked-games/releases/download/GD/Geometry-Dash-Xploits.zip',
    color: '#fbbf24',
  },
  {
    name: 'Schoolboy Runaway',
    version: '1.0',
    description: 'Escape from school, avoid teachers and complete missions in this fun stealth adventure game.',
    tags: ['Adventure', 'Stealth', 'Cracked'],
    size: 'varies',
    download: 'https://github.com/szploit/cracked-games/releases/download/SR/SchoolBoy-Runaway-Xploits.zip',
    color: '#60a5fa',
  },
  {
    name: 'Schoolboy Runaway',
    version: '1.0',
    description: 'A fun first-person indie horror climbing game, with checkpoints and supported for low-end Laptops or Computers.',
    tags: ['Climbing', 'Hardcore', 'Low-End PCS'],
    size: 'varies',
    download: 'https://github.com/szploit/cracked-games/releases/download/IA/IdolsOfAsh_v1_23_WINDOWS.rar',
    color: '#60a5fa',
  },
]

export default function Games() {
  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem 4rem', maxWidth: 900, margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .game-card { background: var(--bg-card); border: 1px solid var(--muted2); border-radius: 14px; padding: 1.5rem; transition: border-color 0.2s, background 0.2s; animation: fadeUp 0.4s ease both; }
        .game-card:hover { border-color: rgba(230,57,70,0.3); background: var(--bg-card2); }
        .dl-btn { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; padding: 10px 22px; border-radius: 9px; background: var(--red); color: #fff; font-family: var(--font-body); font-weight: 600; font-size: 0.88rem; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 0 20px rgba(230,57,70,0.25); }
        .dl-btn:hover { background: var(--red-dim); box-shadow: 0 0 32px rgba(230,57,70,0.4); }
      `}</style>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 3, height: 24, background: 'var(--red)', borderRadius: 2 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Games</h1>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Free cracked games, download and play instantly</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 14 }}>
        {games.map((game, i) => (
          <div key={game.name} className="game-card" style={{ animationDelay: i * 0.08 + 's' }}>
            {}
            <div style={{ width: '100%', height: 3, background: `linear-gradient(90deg, ${game.color}, transparent)`, borderRadius: 2, marginBottom: '1.25rem' }} />

            {}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em', margin: 0 }}>{game.name}</h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: game.color, background: game.color + '15', border: `1px solid ${game.color}30`, padding: '2px 8px', borderRadius: 4 }}>v{game.version}</span>
            </div>

            {}
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>{game.description}</p>

            {}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {game.tags.map(tag => (
                <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--muted2)', padding: '2px 8px', borderRadius: 4 }}>{tag}</span>
              ))}
            </div>

            {}
            <a href={game.download} className="dl-btn">
              ⬇ Download {game.name}
            </a>

            {}
            <p style={{ marginTop: 10, fontSize: '0.7rem', color: 'var(--muted2)', fontFamily: 'var(--font-mono)' }}>
              Extract the .zip and run the executable inside.
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.12)', borderRadius: 10 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
          <span style={{ color: '#fbbf24', fontWeight: 600 }}>Note</span> Games hosted here are for personal use. More games will be added over time. Join the <a href="https://discord.gg/4hseHSkCEE" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--red)', textDecoration: 'none' }}>Discord</a> to suggest games.
        </p>
      </div>
    </div>
  )
}
