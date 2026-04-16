const scripts = new Map()

export function createToken(length = 14) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let out = ''
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return out
}

export function saveScript({ name, content }) {
  let token = createToken()
  while (scripts.has(token)) token = createToken()
  scripts.set(token, {
    name: name || '',
    content,
    createdAt: Date.now(),
  })
  return token
}

export function getScript(token) {
  return scripts.get(token) || null
}
