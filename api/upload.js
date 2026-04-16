import { saveScript } from './_store.js'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
  const name = typeof body.name === 'string' ? body.name : ''
  const content = typeof body.content === 'string' ? body.content : ''

  if (!content.trim()) {
    res.status(400).json({ error: 'Script content is required' })
    return
  }

  const token = saveScript({ name, content })
  const origin = `https://${req.headers.host}`
  res.status(200).json({
    token,
    url: `${origin}/api/${token}/script`,
  })
}
