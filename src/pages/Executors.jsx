import React, { useState } from 'react'

const windowsExecutors = [
  { name: 'Volt', detection: 'Undetected', up: true, price: '$5.99 Weekly', website: 'volt.bz', purchase: 'robloxcheatz.com', discord: 'discord.gg/voltbz', sunc: 'https://sunc.rubis.app/?scrap=R8TAYhDROIHtBfkG&key=ASk65OXbpeyNbEyCKX1nDJaG30mdJ2ap' },
  { name: 'Potassium', detection: 'Undetected', up: true, price: '$22.99 Lifetime', website: 'potassium.pro', purchase: 'bloxproducts.com', discord: 'discord.gg/potassium', sunc: 'https://sunc.rubis.app/?scrap=WGHMg2g0Eemw56r2&key=8TJfLcbRVBRFIvMy9xBHnFLPrWpsfRbd' },
  { name: 'Seliware', detection: 'Detected', up: true, price: '$3.99 Weekly', website: 'seliware.com', purchase: 'robloxcheatz.com', discord: 'https://discord.gg/theseliware', sunc: 'https://sunc.rubis.app/?scrap=YGSnLlcFc9GJcx3t&key=jA4nvLFvy2TomhDZgL1zIrXTn5p9ySbg' },
  { name: 'Wave', detection: 'Undetected', up: false, price: 'Free', website: 'getwave.gg', purchase: 'robloxcheatz.com', discord: 'discord.gg/ykAyabv9', sunc: 'https://sunc.rubis.app/?scrap=sUSMILer2W4h6cEv&key=H4zy64gtK8cyHnjxH3sZUPLBfNHaGC4A' },
  { name: 'Synapse Z', detection: 'Detected', up: false, price: '$3.99 Weekly', website: 'z.synapse.do', purchase: 'angxlzz.store/?ref=synz#products', discord: 'discord.gg/synz', sunc: 'https://sunc.rubis.app/?scrap=MyOUpBJFDFjHPf2B&key=Ip7nZqxEdMXK0KMXJ43lInX016T7qztj' },
  { name: 'Madium', detection: 'Likely Detected', up: true, price: 'Free', website: null, purchase: null, discord: 'discord.gg/olemad', sunc: null },
  { name: 'UniCheats', detection: 'Undetected', up: false, price: '$14.99 Lifetime', website: 'unicheats.online', purchase: 'unicheats.online', discord: 'https://discord.gg/t59SbfRea', sunc: null },
  { name: 'Cosmic', detection: 'Undetected', up: false, price: '$9.99 Lifetime', website: 'cosmic.best', purchase: 'cosmic.best', discord: 'discord.gg/getcosmic', sunc: 'https://sunc.rubis.app/?scrap=NnqoAm6x2mMpwvyi&key=HQfS0tCjYBM0lpTacseWOQvmouTs8qWW' },
  { name: 'Volcano', detection: 'Undetected', up: false, price: '$5.99 Weekly', website: 'volcano.wtf', purchase: 'robloxcheatz.com', discord: null, sunc: 'https://sunc.rubis.app/?scrap=Hi3PrRpwKCKQfSRI&key=zqg8jFsm4mqESnp6hvgSHw1MIrj2vOcT' },
  { name: 'Isaeva', detection: 'Undetected', up: false, price: '$4.99 Weekly', website: 'isaeva.xyz', purchase: 'bloxkeys.com', discord: 'discord.gg/isaeva', sunc: 'https://sunc.rubis.app/?scrap=PVuBLGuIAxToEuaI&key=ZcCtYcgxGimDL7Q9G9sXw5puKbBH27OX' },
  { name: 'Yub-X', detection: 'Likely Detected', up: true, price: null, website: 'yub-x.net', purchase: 'yub-x.net', discord: 'discord.gg/yubx', sunc: null },
  { name: 'Velocity', detection: 'Undetected', up: true, price: 'Free', website: 'realvelocity.xyz', purchase: null, discord: 'discord.gg/velocityide', sunc: 'https://sunc.rubis.app/?scrap=Rz2fo7fxhdneY9d9&key=bQLGtQ5Zln68D9AwzPk52hnYxOtBbcbS' },
  { name: 'Bunni', detection: 'Detected', up: false, price: 'Free', website: null, purchase: 'robloxcheatz.com', discord: 'discord.gg/bunni-fun', sunc: 'https://sunc.rubis.app/?scrap=0HpHPszmPffbANYH&key=kHnUvVsLbSMqSBydsnmRNy8dsfcFhsXR' },
  { name: 'SirHurt', detection: 'Undetected', up: true, price: '$2.80 Weekly', website: 'sirhurt.net', purchase: 'sirhurt.net', discord: 'discord.gg/sirhurt', sunc: 'https://sunc.rubis.app/?scrap=IZ2ozXNNm5IkW94m&key=KGgWvHlfq08uaeB9yHt2eSKDBLraYAqO' },
  { name: 'Xeno', detection: 'Undetected', up: true, price: 'Free', website: 'xeno.onl', purchase: null, discord: 'discord.gg/xe-no', sunc: 'https://sunc.rubis.app/?scrap=bHuVFBkI6jJaT0aX&key=c8yD77H6bDgnptRG0cX0kkVvNePVMBGO' },
  { name: 'Solara', detection: 'Undetected', up: true, price: 'Free', website: null, purchase: null, discord: 'getsolara.dev', sunc: 'https://sunc.rubis.app/?scrap=uXUVoFhAQ6E6n1C4&key=AC5YL7jPBSBKCq4Y8dtKaFDarBHKTiqp' },
]

const androidExecutors = [
  { name: 'Delta', detection: 'Undetected', up: true, price: 'Free', website: 'deltaexploits.gg', purchase: 'deltaexploits.gg', discord: 'discord.gg/deltax', sunc: 'https://sunc.rubis.app/?scrap=ju715lqo46qpiR1c&key=9BRz1IBo7t8vVBaHgnaOZ1xRDNNtdAF9' },
  { name: 'Vega X', detection: 'Undetected', up: true, price: 'Free', website: 'vegax.gg', purchase: 'vegaexploits.gg', discord: null, sunc: null },
  { name: 'Codex', detection: 'Undetected', up: true, price: 'Free', website: 'codex.lol', purchase: null, discord: 'discord.gg/codexlol', sunc: 'https://sunc.rubis.app/?scrap=U1qoiWmhnXU4xX8K&key=CJOxliNasyotGtl1QWl2ydRASGmvybqo' },
  { name: 'Cryptic', detection: 'Undetected', up: false, price: 'Free', website: null, purchase: null, discord: 'https://discord.com/invite/vegasupport', sunc: 'https://sunc.rubis.app/?scrap=pTqBpY0oIxJBpcMV&key=V7fuG4KxZVbyApRXoMZr3OyO34r6LK0I' },
]

const iosExecutors = [
  { name: 'Delta', detection: 'Undetected', up: true, price: 'Free', website: 'deltaexploits.gg', purchase: 'deltaexploits.gg', discord: 'discord.gg/deltax', sunc: 'https://sunc.rubis.app/?scrap=ju715lqo46qpiR1c&key=9BRz1IBo7t8vVBaHgnaOZ1xRDNNtdAF9' },
]

function LinkBtn({ href, label }) {
  if (!href) return null
  const url = href.startsWith('http') ? href : 'https://' + href
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      textDecoration: 'none', fontSize: '0.72rem', fontFamily: 'var(--font-mono)',
      color: 'var(--muted)', background: 'var(--bg)', border: '1px solid var(--muted2)',
      borderRadius: 6, padding: '3px 8px', transition: 'color 0.15s, border-color 0.15s', whiteSpace: 'nowrap',
    }}
      onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(230,57,70,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--muted2)' }}
    >{label}</a>
  )
}

function SuncBadge({ url }) {
  if (!url) return null
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      textDecoration: 'none', fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
      color: '#a78bfa',
      background: 'rgba(167,139,250,0.08)',
      border: '1px solid rgba(167,139,250,0.2)',
      borderRadius: 6, padding: '3px 8px',
      transition: 'all 0.15s', whiteSpace: 'nowrap',
      fontWeight: 600, letterSpacing: '0.02em',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.16)'; e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)'; e.currentTarget.style.color = '#c4b5fd' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.08)'; e.currentTarget.style.borderColor = 'rgba(167,139,250,0.2)'; e.currentTarget.style.color = '#a78bfa' }}
    >sUNC ↗</a>
  )
}

function ExecutorRow({ ex, i }) {
  const upColor = ex.up ? '#4ade80' : '#e63946'
  const detColor =
    ex.detection === 'Undetected' ? '#4ade80'
    : ex.detection === 'Likely Detected' ? '#a855f7'
    : '#fbbf24'

  return (
    <div className="exec-row" style={{ animationDelay: i * 0.04 + 's' }}>
      <div style={{ width: 3, alignSelf: 'stretch', background: upColor, borderRadius: 2, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>{ex.name}</span>
          {ex.price && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
              color: ex.price === 'Free' ? '#4ade80' : '#fbbf24',
              background: ex.price === 'Free' ? 'rgba(74,222,128,0.08)' : 'rgba(251,191,36,0.08)',
              padding: '2px 7px', borderRadius: 4,
              border: '1px solid ' + (ex.price === 'Free' ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)'),
            }}>{ex.price}</span>
          )}
          <SuncBadge url={ex.sunc} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <LinkBtn href={ex.website} label="🌐 Website" />
          <LinkBtn href={ex.purchase} label="🛒 Purchase" />
          <LinkBtn href={ex.discord} label="💬 Discord" />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
        <div style={{ padding: '3px 10px', borderRadius: 100, background: detColor + '18', color: detColor, border: '1px solid ' + detColor + '30', fontSize: '0.72rem', fontWeight: 600, fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
          {ex.detection}
        </div>
        <div style={{ padding: '3px 10px', borderRadius: 100, background: upColor + '18', color: upColor, border: '1px solid ' + upColor + '30', fontSize: '0.72rem', fontWeight: 600, fontFamily: 'var(--font-body)' }}>
          {ex.up ? 'Up' : 'Down'}
        </div>
      </div>
    </div>
  )
}

function Section({ title, executors, startIndex }) {
  if (!executors.length) return null
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
        <div style={{ width: 3, height: 18, background: 'var(--red)', borderRadius: 2 }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</h2>
        <div style={{ flex: 1, height: '1px', background: 'var(--muted2)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>{executors.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {executors.map((ex, i) => <ExecutorRow key={ex.name + i} ex={ex} i={startIndex + i} />)}
      </div>
    </div>
  )
}

export default function Executors() {
  const [search, setSearch] = useState('')
  const f = list => search ? list.filter(e => e.name.toLowerCase().includes(search.toLowerCase())) : list
  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem 4rem', maxWidth: 900, margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .exec-row { display:flex; align-items:center; gap:14px; padding:1rem 1.25rem; background:var(--bg-card); border:1px solid var(--muted2); border-radius:10px; transition:border-color 0.2s,background 0.2s; animation:fadeUp 0.4s ease both; }
        .exec-row:hover { border-color:rgba(230,57,70,0.3); background:var(--bg-card2); }
      `}</style>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 3, height: 24, background: 'var(--red)', borderRadius: 2 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Executors</h1>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>Live status tracking for Roblox script executors</p>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search executors..." style={{ background: 'var(--bg-card)', border: '1px solid var(--muted2)', borderRadius: 8, padding: '8px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', outline: 'none', width: 240 }} />
      </div>
      <Section title="Windows" executors={f(windowsExecutors)} startIndex={0} />
      <Section title="Android" executors={f(androidExecutors)} startIndex={windowsExecutors.length} />
      <Section title="iOS" executors={f(iosExecutors)} startIndex={windowsExecutors.length + androidExecutors.length} />
    </div>
  )
}
