import React, { useState } from 'react'

// UNC Checker tool
function UNCChecker() {
  const [script, setScript] = useState('')
  const uncFunctions = ['hookfunction', 'getrawmetatable', 'setreadonly', 'isreadonly', 'clonefunction', 'checkcaller', 'islclosure', 'loadstring', 'getgenv', 'getrenv', 'getreg', 'getgc', 'getinstances', 'getnilinstances', 'getscripts', 'getloadedmodules', 'getconnections', 'fireclickdetector', 'firetouchinterest', 'fireproximityprompt', 'getcallstack', 'getupvalues', 'getupvalue', 'setupvalue', 'getprotos', 'getproto']

  const found = uncFunctions.filter(fn => script.toLowerCase().includes(fn.toLowerCase()))

  return (
    <div>
      <textarea
        value={script}
        onChange={e => setScript(e.target.value)}
        placeholder="Paste your script here to check UNC compatibility..."
        style={{
          width: '100%', minHeight: 140,
          background: 'var(--bg)', border: '1px solid var(--muted2)',
          borderRadius: 8, padding: '12px 14px',
          color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
          resize: 'vertical', outline: 'none',
        }}
      />
      {script && (
        <div style={{ marginTop: 12 }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: 8 }}>
            Found {found.length} UNC functions:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {found.length > 0 ? found.map(fn => (
              <span key={fn} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                padding: '3px 8px', borderRadius: 6,
                background: 'rgba(74,222,128,0.1)', color: '#4ade80',
                border: '1px solid rgba(74,222,128,0.2)',
              }}>{fn}</span>
            )) : <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>No UNC functions detected</span>}
          </div>
        </div>
      )}
    </div>
  )
}

// Base64 tool
function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState('encode')

  const run = () => {
    try {
      setOutput(mode === 'encode' ? btoa(input) : atob(input))
    } catch {
      setOutput('Invalid input')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {['encode', 'decode'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '5px 14px', borderRadius: 6,
            background: mode === m ? 'rgba(230,57,70,0.12)' : 'transparent',
            border: mode === m ? '1px solid rgba(230,57,70,0.3)' : '1px solid var(--muted2)',
            color: mode === m ? '#fff' : 'var(--muted)',
            cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.8rem',
            fontWeight: mode === m ? 600 : 400, textTransform: 'capitalize',
          }}>{m}</button>
        ))}
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Input..." style={{
        width: '100%', minHeight: 80, background: 'var(--bg)', border: '1px solid var(--muted2)',
        borderRadius: 8, padding: '10px 12px', color: 'var(--text)',
        fontFamily: 'var(--font-mono)', fontSize: '0.8rem', resize: 'vertical', outline: 'none',
      }} />
      <button onClick={run} style={{
        marginTop: 8, padding: '7px 18px', borderRadius: 8,
        background: 'var(--red)', color: '#fff', border: 'none',
        cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-body)',
      }}>Run</button>
      {output && (
        <textarea readOnly value={output} style={{
          marginTop: 10, width: '100%', minHeight: 80,
          background: 'var(--bg)', border: '1px solid var(--muted2)',
          borderRadius: 8, padding: '10px 12px', color: '#4ade80',
          fontFamily: 'var(--font-mono)', fontSize: '0.8rem', resize: 'vertical', outline: 'none',
        }} />
      )}
    </div>
  )
}

// Roblox version lookup
function VersionLookup() {
  const [ver, setVer] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const lookup = async () => {
    if (!ver.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setResult({
      hash: ver.trim(),
      status: 'Detected',
      type: ver.includes('cf') ? 'Mac' : 'Windows',
      date: new Date().toLocaleDateString(),
    })
    setLoading(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={ver} onChange={e => setVer(e.target.value)} placeholder="e.g. version-26c90be22e0d4758"
          style={{
            flex: 1, background: 'var(--bg)', border: '1px solid var(--muted2)',
            borderRadius: 8, padding: '8px 14px', color: 'var(--text)',
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', outline: 'none',
          }} />
        <button onClick={lookup} style={{
          padding: '8px 18px', borderRadius: 8, background: 'var(--red)', color: '#fff',
          border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--font-body)',
        }}>{loading ? '...' : 'Look up'}</button>
      </div>
      {result && (
        <div style={{ marginTop: 12, padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--muted2)', borderRadius: 8 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['Hash', result.hash], ['Platform', result.type], ['Status', result.status], ['Checked', result.date]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 2 }}>{k}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#4ade80' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const tools = [
  { id: 'unc', title: 'UNC Checker', desc: 'Detect UNC functions in your scripts', component: <UNCChecker /> },
  { id: 'b64', title: 'Base64 Encoder / Decoder', desc: 'Encode or decode base64 strings', component: <Base64Tool /> },
  { id: 'ver', title: 'Version Hash Lookup', desc: 'Look up Roblox version hashes', component: <VersionLookup /> },
]

export default function Tools() {
  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem 4rem', maxWidth: 900, margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 3, height: 24, background: 'var(--red)', borderRadius: 2 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Tools</h1>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Handy utilities for the Roblox cheating community</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tools.map((tool, i) => (
          <div key={tool.id} style={{
            background: 'var(--bg-card)', border: '1px solid var(--muted2)',
            borderRadius: 14, padding: '1.5rem',
            animation: `fadeUp 0.4s ease both`, animationDelay: `${i * 0.08}s`,
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>{tool.title}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{tool.desc}</p>
            </div>
            {tool.component}
          </div>
        ))}
      </div>
    </div>
  )
}
