import { getScript } from '../_store.js'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).send('Method not allowed')
    return
  }

  const { token } = req.query || {}
  if (!token || typeof token !== 'string') {
    res.status(400).send('Invalid token')
    return
  }

  const script = getScript(token)
  if (!script) {
    res.status(404).send('')
    return
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.status(200).send(script.content)
}
