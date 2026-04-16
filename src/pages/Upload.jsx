import React, { useMemo, useState } from 'react'

export default function Upload() {
  const [scriptName, setScriptName] = useState('')
  const [scriptText, setScriptText] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const isValid = useMemo(() => scriptText.trim().length > 0, [scriptText])

  const onFilePick = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setScriptName(file.name)
    try {
      const text = await file.text()
      setScriptText(text)
      setError('')
    } catch {
      setError('Could not read file')
    }
  }

  const uploadScript = async () => {
    if (!isValid) {
      setError('Paste a script or upload a file first')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedLink('')
    setCopied(false)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: scriptName.trim(),
          content: scriptText,
        }),
      })
      const raw = await res.text()
      let data = null
      if (raw) {
        try {
          data = JSON.parse(raw)
        } catch {
          data = null
        }
      }
      if (!res.ok || !data?.url) {
        if (!res.ok && !data) {
          throw new Error('Upload API unavailable. On Cloudflare, deploy Pages Functions and bind KV namespace SCRIPTS.')
        }
        throw new Error(data?.error || 'Upload failed')
      }
      const absoluteUrl = data.url.startsWith('http')
        ? data.url
        : `${window.location.origin}${data.url}`
      setGeneratedLink(absoluteUrl)
    } catch (err) {
      setError(err?.message || 'Upload failed')
    }

    setLoading(false)
  }

  const copyLink = async () => {
    if (!generatedLink) return
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setError('Could not copy link')
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--bg)',
    border: '1px solid var(--muted2)',
    borderRadius: 8,
    padding: '9px 12px',
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.82rem',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem 4rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 3, height: 24, background: 'var(--red)', borderRadius: 2 }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Upload</h1>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Upload a script and generate a unique link</p>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--muted2)', borderRadius: 14, padding: '1.5rem' }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 5, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            Script Name (optional)
          </label>
          <input
            value={scriptName}
            onChange={e => setScriptName(e.target.value)}
            placeholder="my-script.lua"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 5, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            Upload File
          </label>
          <input
            type="file"
            accept=".lua,.txt,.json,.js,.ts"
            onChange={onFilePick}
            style={{ ...inputStyle, padding: '7px 10px' }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 5, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            Script Content
          </label>
          <textarea
            value={scriptText}
            onChange={e => setScriptText(e.target.value)}
            placeholder="Paste your script here..."
            style={{ ...inputStyle, minHeight: 220, resize: 'vertical' }}
          />
        </div>

        <button
          onClick={uploadScript}
          disabled={loading}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: 10,
            background: loading ? 'var(--surface)' : 'var(--red)',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.95rem',
          }}
        >
          {loading ? 'Uploading...' : 'Upload & Generate Link'}
        </button>

        {error && (
          <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 8, background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.2)', color: '#ff8b8b', fontSize: '0.82rem', fontFamily: 'var(--font-body)' }}>
            X {error}
          </div>
        )}

        {generatedLink && (
          <div style={{ marginTop: 12, padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--muted2)', borderRadius: 8 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 6 }}>Generated Link</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#4ade80', wordBreak: 'break-all' }}>{generatedLink}</div>
            <button
              onClick={copyLink}
              style={{ marginTop: 10, padding: '7px 14px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--muted2)', color: copied ? '#4ade80' : 'var(--muted)', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
