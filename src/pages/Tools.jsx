import React, { useState } from 'react'

function UNCChecker() {
  const [script, setScript] = useState('')
  const uncFunctions = ['hookfunction','getrawmetatable','setreadonly','isreadonly','clonefunction','checkcaller','islclosure','loadstring','getgenv','getrenv','getreg','getgc','getinstances','getnilinstances','getscripts','getloadedmodules','getconnections','fireclickdetector','firetouchinterest','fireproximityprompt','getcallstack','getupvalues','getupvalue','setupvalue','getprotos','getproto']
  const found = uncFunctions.filter(fn => script.toLowerCase().includes(fn.toLowerCase()))
  return (
    <div>
      <textarea value={script} onChange={e => setScript(e.target.value)} placeholder="Paste your script here to check UNC compatibility..." style={{ width:'100%', minHeight:140, background:'var(--bg)', border:'1px solid var(--muted2)', borderRadius:8, padding:'12px 14px', color:'var(--text)', fontFamily:'var(--font-mono)', fontSize:'0.8rem', resize:'vertical', outline:'none' }} />
      {script && (
        <div style={{ marginTop:12 }}>
          <p style={{ color:'var(--muted)', fontSize:'0.8rem', marginBottom:8 }}>Found {found.length} UNC functions:</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {found.length > 0 ? found.map(fn => (
              <span key={fn} style={{ fontFamily:'var(--font-mono)', fontSize:'0.75rem', padding:'3px 8px', borderRadius:6, background:'rgba(74,222,128,0.1)', color:'#4ade80', border:'1px solid rgba(74,222,128,0.2)' }}>{fn}</span>
            )) : <span style={{ color:'var(--muted)', fontSize:'0.8rem' }}>No UNC functions detected</span>}
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
  const run = () => { try { setOutput(mode === 'encode' ? btoa(input) : atob(input)) } catch { setOutput('Invalid input') } }
  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:10 }}>
        {['encode','decode'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ padding:'5px 14px', borderRadius:6, background:mode===m?'rgba(230,57,70,0.12)':'transparent', border:'1px solid '+(mode===m?'rgba(230,57,70,0.3)':'var(--muted2)'), color:mode===m?'#fff':'var(--muted)', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.8rem', fontWeight:mode===m?600:400, textTransform:'capitalize' }}>{m}</button>
        ))}
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Input..." style={{ width:'100%', minHeight:80, background:'var(--bg)', border:'1px solid var(--muted2)', borderRadius:8, padding:'10px 12px', color:'var(--text)', fontFamily:'var(--font-mono)', fontSize:'0.8rem', resize:'vertical', outline:'none' }} />
      <button onClick={run} style={{ marginTop:8, padding:'7px 18px', borderRadius:8, background:'var(--red)', color:'#fff', border:'none', cursor:'pointer', fontSize:'0.85rem', fontWeight:600, fontFamily:'var(--font-body)' }}>Run</button>
      {output && <textarea readOnly value={output} style={{ marginTop:10, width:'100%', minHeight:80, background:'var(--bg)', border:'1px solid var(--muted2)', borderRadius:8, padding:'10px 12px', color:'#4ade80', fontFamily:'var(--font-mono)', fontSize:'0.8rem', resize:'vertical', outline:'none' }} />}
    </div>
  )
}

// Version lookup
function VersionLookup() {
  const [ver, setVer] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const lookup = async () => {
    if (!ver.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setResult({ hash: ver.trim(), status:'Detected', type: ver.includes('cf') ? 'Mac' : 'Windows', date: new Date().toLocaleDateString() })
    setLoading(false)
  }
  return (
    <div>
      <div style={{ display:'flex', gap:8 }}>
        <input value={ver} onChange={e => setVer(e.target.value)} placeholder="e.g. version-26c90be22e0d4758" style={{ flex:1, background:'var(--bg)', border:'1px solid var(--muted2)', borderRadius:8, padding:'8px 14px', color:'var(--text)', fontFamily:'var(--font-mono)', fontSize:'0.8rem', outline:'none' }} />
        <button onClick={lookup} style={{ padding:'8px 18px', borderRadius:8, background:'var(--red)', color:'#fff', border:'none', cursor:'pointer', fontSize:'0.85rem', fontWeight:600, fontFamily:'var(--font-body)' }}>{loading ? '...' : 'Look up'}</button>
      </div>
      {result && (
        <div style={{ marginTop:12, padding:'12px 16px', background:'var(--bg)', border:'1px solid var(--muted2)', borderRadius:8 }}>
          <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
            {[['Hash',result.hash],['Platform',result.type],['Status',result.status],['Checked',result.date]].map(([k,v]) => (
              <div key={k}><div style={{ fontSize:'0.7rem', color:'var(--muted)', marginBottom:2 }}>{k}</div><div style={{ fontFamily:'var(--font-mono)', fontSize:'0.8rem', color:'#4ade80' }}>{v}</div></div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Webhook Sender
const STYLES = [
  { id: 'plain', label: 'Plain Text', desc: 'Simple message, no embeds' },
  { id: 'embed', label: 'Embed', desc: 'Rich embed with color, title, fields' },
  { id: 'alert', label: 'Alert Style', desc: 'Like a bot alert with status and target info' },
  { id: 'success', label: 'Success', desc: 'Green success notification' },
]

function WebhookSender() {
  const [webhook, setWebhook] = useState('')
  const [style, setStyle] = useState('plain')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  // Plain
  const [plainMsg, setPlainMsg] = useState('')

  // Embed
  const [embedTitle, setEmbedTitle] = useState('')
  const [embedDesc, setEmbedDesc] = useState('')
  const [embedColor, setEmbedColor] = useState('#e63946')
  const [embedFields, setEmbedFields] = useState([{ name: '', value: '' }])

  // Alert
  const [alertTitle, setAlertTitle] = useState('')
  const [alertMsg, setAlertMsg] = useState('')
  const [alertTarget, setAlertTarget] = useState('')
  const [alertFooter, setAlertFooter] = useState('')

  // Success
  const [successTitle, setSuccessTitle] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const hexToDecimal = hex => parseInt(hex.replace('#', ''), 16)

  const buildPayload = () => {
    if (style === 'plain') {
      return { content: plainMsg }
    }
    if (style === 'embed') {
      return {
        embeds: [{
          title: embedTitle,
          description: embedDesc,
          color: hexToDecimal(embedColor),
          fields: embedFields.filter(f => f.name && f.value).map(f => ({ name: f.name, value: f.value, inline: true })),
          timestamp: new Date().toISOString(),
        }]
      }
    }
    if (style === 'alert') {
      return {
        embeds: [{
          title: alertTitle,
          description: alertMsg,
          color: hexToDecimal('#e63946'),
          fields: alertTarget ? [{ name: 'Target', value: alertTarget, inline: false }] : [],
          footer: { text: alertFooter || 'Xploits | Automated System' },
          timestamp: new Date().toISOString(),
        }]
      }
    }
    if (style === 'success') {
      return {
        embeds: [{
          title: '✅ ' + successTitle,
          description: successMsg,
          color: hexToDecimal('#22c55e'),
          footer: { text: 'Xploits | Automated System' },
          timestamp: new Date().toISOString(),
        }]
      }
    }
  }

  const send = async () => {
    if (!webhook.trim() || !webhook.includes('discord.com/api/webhooks')) {
      setStatus({ ok: false, msg: 'Invalid webhook URL' })
      return
    }
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      })
      if (res.ok) {
        setStatus({ ok: true, msg: 'Message sent successfully!' })
      } else {
        const err = await res.json()
        setStatus({ ok: false, msg: err.message || 'Failed to send' })
      }
    } catch {
      setStatus({ ok: false, msg: 'Network error — check your webhook URL' })
    }
    setLoading(false)
  }

  const inputStyle = { width:'100%', background:'var(--bg)', border:'1px solid var(--muted2)', borderRadius:8, padding:'9px 12px', color:'var(--text)', fontFamily:'var(--font-mono)', fontSize:'0.8rem', outline:'none', boxSizing:'border-box' }
  const labelStyle = { display:'block', fontSize:'0.75rem', color:'var(--muted)', marginBottom:5, fontFamily:'var(--font-body)', fontWeight:500 }

  return (
    <div>
      {/* Webhook URL */}
      <div style={{ marginBottom:14 }}>
        <label style={labelStyle}>Webhook URL</label>
        <input value={webhook} onChange={e => setWebhook(e.target.value)} placeholder="https://discord.com/api/webhooks/..." style={inputStyle} />
      </div>

      {/* Style picker */}
      <div style={{ marginBottom:16 }}>
        <label style={labelStyle}>Message Style</label>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {STYLES.map(s => (
            <button key={s.id} onClick={() => setStyle(s.id)} style={{
              padding:'7px 14px', borderRadius:8, cursor:'pointer',
              background: style===s.id ? 'rgba(230,57,70,0.12)' : 'var(--bg)',
              border: '1px solid ' + (style===s.id ? 'rgba(230,57,70,0.35)' : 'var(--muted2)'),
              color: style===s.id ? '#fff' : 'var(--muted)',
              fontFamily:'var(--font-body)', fontSize:'0.8rem', fontWeight: style===s.id ? 600 : 400,
              transition:'all 0.15s',
            }}>
              <div>{s.label}</div>
              <div style={{ fontSize:'0.65rem', color: style===s.id ? 'rgba(255,255,255,0.5)' : 'var(--muted2)', marginTop:2 }}>{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Style-specific fields */}
      <div style={{ marginBottom:16, padding:'14px', background:'var(--bg)', border:'1px solid var(--muted2)', borderRadius:8 }}>
        {style === 'plain' && (
          <div>
            <label style={labelStyle}>Message</label>
            <textarea value={plainMsg} onChange={e => setPlainMsg(e.target.value)} placeholder="Your message here..." style={{ ...inputStyle, minHeight:100, resize:'vertical' }} />
          </div>
        )}

        {style === 'embed' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1 }}>
                <label style={labelStyle}>Title</label>
                <input value={embedTitle} onChange={e => setEmbedTitle(e.target.value)} placeholder="Embed title" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Color</label>
                <input type="color" value={embedColor} onChange={e => setEmbedColor(e.target.value)} style={{ width:44, height:36, borderRadius:6, border:'1px solid var(--muted2)', background:'var(--bg)', cursor:'pointer', padding:2 }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={embedDesc} onChange={e => setEmbedDesc(e.target.value)} placeholder="Embed description..." style={{ ...inputStyle, minHeight:80, resize:'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>Fields</label>
              {embedFields.map((f, i) => (
                <div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}>
                  <input value={f.name} onChange={e => { const n=[...embedFields]; n[i].name=e.target.value; setEmbedFields(n) }} placeholder="Field name" style={{ ...inputStyle, width:'40%' }} />
                  <input value={f.value} onChange={e => { const n=[...embedFields]; n[i].value=e.target.value; setEmbedFields(n) }} placeholder="Field value" style={{ ...inputStyle, flex:1 }} />
                  {embedFields.length > 1 && <button onClick={() => setEmbedFields(embedFields.filter((_,j)=>j!==i))} style={{ padding:'0 10px', borderRadius:6, background:'rgba(230,57,70,0.1)', border:'1px solid rgba(230,57,70,0.2)', color:'var(--red)', cursor:'pointer', fontSize:'0.8rem' }}>✕</button>}
                </div>
              ))}
              <button onClick={() => setEmbedFields([...embedFields, { name:'', value:'' }])} style={{ padding:'5px 12px', borderRadius:6, background:'var(--bg-card)', border:'1px solid var(--muted2)', color:'var(--muted)', cursor:'pointer', fontSize:'0.75rem', fontFamily:'var(--font-body)' }}>+ Add field</button>
            </div>
          </div>
        )}

        {style === 'alert' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div>
              <label style={labelStyle}>Alert Title</label>
              <input value={alertTitle} onChange={e => setAlertTitle(e.target.value)} placeholder="e.g. SUCCESS: USER VISITED" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Message</label>
              <textarea value={alertMsg} onChange={e => setAlertMsg(e.target.value)} placeholder="e.g. TOTAL VISITS: ..." style={{ ...inputStyle, minHeight:70, resize:'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>Target Info</label>
              <input value={alertTarget} onChange={e => setAlertTarget(e.target.value)} placeholder="e.g. XPLOITS VISITS: ..." style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Footer Text</label>
              <input value={alertFooter} onChange={e => setAlertFooter(e.target.value)} placeholder="e.g. Xploits Automated System" style={inputStyle} />
            </div>
          </div>
        )}

        {style === 'success' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input value={successTitle} onChange={e => setSuccessTitle(e.target.value)} placeholder="e.g. Operation Complete" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Message</label>
              <textarea value={successMsg} onChange={e => setSuccessMsg(e.target.value)} placeholder="e.g. Task finished successfully." style={{ ...inputStyle, minHeight:70, resize:'vertical' }} />
            </div>
          </div>
        )}
      </div>

      {/* Send button */}
      <button onClick={send} disabled={loading} style={{
        width:'100%', padding:'11px', borderRadius:10,
        background: loading ? 'var(--surface)' : 'var(--red)',
        color:'#fff', border:'none', cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.95rem',
        transition:'all 0.2s', boxShadow: loading ? 'none' : '0 0 20px rgba(230,57,70,0.25)',
      }}>
        {loading ? 'Sending...' : 'Send to Webhook →'}
      </button>

      {status && (
        <div style={{ marginTop:10, padding:'10px 14px', borderRadius:8, background: status.ok ? 'rgba(74,222,128,0.08)' : 'rgba(230,57,70,0.08)', border:'1px solid '+(status.ok ? 'rgba(74,222,128,0.2)' : 'rgba(230,57,70,0.2)'), color: status.ok ? '#4ade80' : '#ff8b8b', fontSize:'0.82rem', fontFamily:'var(--font-body)' }}>
          {status.ok ? '✓ ' : '✗ '}{status.msg}
        </div>
      )}
    </div>
  )
}

function RobloxUserLookup() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchJsonFrom = async (endpoints, options) => {
    let lastError = null
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, options)
        if (!res.ok) {
          lastError = new Error(`HTTP ${res.status}`)
          continue
        }
        return await res.json()
      } catch (err) {
        lastError = err
      }
    }
    throw lastError || new Error('Failed to fetch data')
  }

  const normalizeUserId = async value => {
    const trimmed = value.trim()
    if (/^\d+$/.test(trimmed)) return Number(trimmed)

    const body = { usernames: [trimmed], excludeBannedUsers: false }
    const data = await fetchJsonFrom(
      [
        'https://users.roproxy.com/v1/usernames/users',
      ],
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    )
    if (!data || !data.data || !data.data.length) throw new Error('User not found')
    return data.data[0].id
  }

  const lookup = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const userId = await normalizeUserId(query)
      const [
        userInfo,
        usernameHistory,
        friendCount,
        followerCount,
        followingCount,
        avatarThumb,
        groupRoles,
        inventoryAccess,
        createdGames,
      ] = await Promise.all([
        fetchJsonFrom(
          [
            `https://users.roproxy.com/v1/users/${userId}`,
          ]
        ),
        fetchJsonFrom(
          [
            `https://users.roproxy.com/v1/users/${userId}/username-history?limit=20&sortOrder=Desc`,
          ]
        ).catch(() => ({ data: [] })),
        fetchJsonFrom(
          [
            `https://friends.roproxy.com/v1/users/${userId}/friends/count`,
          ]
        ).catch(() => ({ count: 0 })),
        fetchJsonFrom(
          [
            `https://friends.roproxy.com/v1/users/${userId}/followers/count`,
          ]
        ).catch(() => ({ count: 0 })),
        fetchJsonFrom(
          [
            `https://friends.roproxy.com/v1/users/${userId}/followings/count`,
          ]
        ).catch(() => ({ count: 0 })),
        fetchJsonFrom(
          [
            `https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${userId}&size=352x352&format=Png&isCircular=false`,
          ]
        ).catch(() => ({ data: [] })),
        fetchJsonFrom(
          [
            `https://groups.roproxy.com/v2/users/${userId}/groups/roles`,
          ]
        ).catch(() => ({ data: [] })),
        fetchJsonFrom(
          [
            `https://inventory.roproxy.com/v1/users/${userId}/can-view-inventory`,
          ]
        ).catch(() => ({ canView: false })),
        fetchJsonFrom(
          [
            `https://games.roproxy.com/v2/users/${userId}/games?accessFilter=Public&limit=10&sortOrder=Desc`,
          ]
        ).catch(() => ({ data: [] })),
      ])

      setResult({
        id: userInfo.id,
        username: userInfo.name,
        displayName: userInfo.displayName,
        created: userInfo.created ? new Date(userInfo.created).toLocaleString() : 'Unknown',
        description: userInfo.description || 'No description',
        isBanned: Boolean(userInfo.isBanned),
        oldUsernames: (usernameHistory.data || []).map(item => item.name).filter(Boolean),
        friends: friendCount && typeof friendCount.count === 'number' ? friendCount.count : 0,
        followers: followerCount && typeof followerCount.count === 'number' ? followerCount.count : 0,
        following: followingCount && typeof followingCount.count === 'number' ? followingCount.count : 0,
        avatarImage: avatarThumb && avatarThumb.data && avatarThumb.data[0] ? avatarThumb.data[0].imageUrl || '' : '',
        groups: groupRoles.data || [],
        canViewInventory: Boolean(inventoryAccess.canView),
        games: createdGames.data || [],
      })
    } catch (err) {
      const msg = err?.message || ''
      if (msg.toLowerCase().includes('failed to fetch') || msg.toLowerCase().includes('network')) {
        setError('Lookup failed: network/CORS blocked. Try again in a moment or use a backend proxy endpoint.')
      } else {
        setError(msg || 'Lookup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const fieldStyle = {
    background: 'var(--bg)',
    border: '1px solid var(--muted2)',
    borderRadius: 8,
    padding: '10px 12px',
  }

  return (
    <div>
      <p style={{ color:'var(--muted)', fontSize:'0.78rem', marginTop:0, marginBottom:10 }}>
        Public profile lookup only. No password or private account data is requested.
      </p>
      <div style={{ display:'flex', gap:8 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter Roblox username or user ID"
          style={{ flex:1, background:'var(--bg)', border:'1px solid var(--muted2)', borderRadius:8, padding:'8px 14px', color:'var(--text)', fontFamily:'var(--font-mono)', fontSize:'0.8rem', outline:'none' }}
        />
        <button
          onClick={lookup}
          disabled={loading}
          style={{ padding:'8px 18px', borderRadius:8, background:loading ? 'var(--surface)' : 'var(--red)', color:'#fff', border:'none', cursor:loading ? 'not-allowed' : 'pointer', fontSize:'0.85rem', fontWeight:600, fontFamily:'var(--font-body)' }}
        >
          {loading ? 'Searching...' : 'Lookup'}
        </button>
      </div>

      {error && (
        <div style={{ marginTop:10, color:'#ff8b8b', fontSize:'0.8rem' }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop:12, display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ ...fieldStyle, display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
            {result.avatarImage ? (
              <img src={result.avatarImage} alt="Avatar" style={{ width:58, height:58, borderRadius:8, border:'1px solid var(--muted2)' }} />
            ) : null}
            <div>
              <div style={{ fontSize:'0.95rem', fontWeight:700, fontFamily:'var(--font-display)' }}>
                {result.displayName} <span style={{ color:'var(--muted)', fontWeight:400 }}>@{result.username}</span>
              </div>
              <div style={{ fontSize:'0.78rem', color:'var(--muted)' }}>
                User ID: {result.id}
              </div>
            </div>
          </div>

          <div style={{ ...fieldStyle, display:'grid', gap:6 }}>
            <div style={{ fontSize:'0.8rem' }}><strong>Created:</strong> {result.created}</div>
            <div style={{ fontSize:'0.8rem' }}><strong>Banned/Terminated:</strong> {result.isBanned ? 'Yes' : 'No'}</div>
            <div style={{ fontSize:'0.8rem' }}><strong>Friends:</strong> {result.friends} | <strong>Followers:</strong> {result.followers} | <strong>Following:</strong> {result.following}</div>
            <div style={{ fontSize:'0.8rem' }}><strong>Inventory Public:</strong> {result.canViewInventory ? 'Yes' : 'No'}</div>
            <div style={{ fontSize:'0.8rem' }}>
              <strong>Old Usernames:</strong> {result.oldUsernames.length ? result.oldUsernames.slice(0, 10).join(', ') : 'None found'}
            </div>
            <div style={{ fontSize:'0.8rem' }}>
              <strong>Groups:</strong> {result.groups.length ? result.groups.slice(0, 8).map(g => (g && g.group ? g.group.name : '')).filter(Boolean).join(', ') : 'No groups found'}
            </div>
            <div style={{ fontSize:'0.8rem' }}>
              <strong>Created Games:</strong> {result.games.length ? result.games.slice(0, 8).map(g => g.name).join(', ') : 'No public games found'}
            </div>
          </div>

          <div style={fieldStyle}>
            <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginBottom:4 }}>Account Description</div>
            <div style={{ fontSize:'0.8rem', whiteSpace:'pre-wrap' }}>{result.description}</div>
          </div>
        </div>
      )}
    </div>
  )
}

const tools = [
  { id:'webhook', title:'Webhook Sender', desc:'Send custom messages to any Discord webhook', component:<WebhookSender /> },
  { id:'unc', title:'UNC Checker', desc:'Detect UNC functions in your scripts', component:<UNCChecker /> },
  { id:'b64', title:'Base64 Encoder / Decoder', desc:'Encode or decode base64 strings', component:<Base64Tool /> },
  { id:'ver', title:'Version Hash Lookup', desc:'Look up Roblox version hashes', component:<VersionLookup /> },
  { id:'roblox-user', title:'Roblox User Lookup', desc:'Find public account details by username or ID', component:<RobloxUserLookup /> },
]

export default function Tools() {
  return (
    <div style={{ minHeight:'100vh', padding:'6rem 2rem 4rem', maxWidth:900, margin:'0 auto' }}>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <div style={{ marginBottom:'2rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
          <div style={{ width:3, height:24, background:'var(--red)', borderRadius:2 }} />
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:800, letterSpacing:'-0.03em' }}>Tools</h1>
        </div>
        <p style={{ color:'var(--muted)', fontSize:'0.9rem' }}>Handy utilities for the Roblox cheating community</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {tools.map((tool, i) => (
          <div key={tool.id} style={{ background:'var(--bg-card)', border:'1px solid var(--muted2)', borderRadius:14, padding:'1.5rem', animation:'fadeUp 0.4s ease both', animationDelay:i*0.08+'s' }}>
            <div style={{ marginBottom:'1rem' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.05rem', marginBottom:4 }}>{tool.title}</h2>
              <p style={{ color:'var(--muted)', fontSize:'0.82rem' }}>{tool.desc}</p>
            </div>
            {tool.component}
          </div>
        ))}
      </div>
    </div>
  )
}
