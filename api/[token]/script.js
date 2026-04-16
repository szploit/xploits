export async function onRequestGet(context) {
  const { params, env } = context

  if (!env.SCRIPTS) {
    return new Response('Missing KV binding: SCRIPTS', { status: 500 })
  }

  const token = params?.token
  if (!token || typeof token !== 'string') {
    return new Response('Invalid token', { status: 400 })
  }

  const raw = await env.SCRIPTS.get(token)
  if (!raw) {
    return new Response('', { status: 404 })
  }

  let parsed = null
  try {
    parsed = JSON.parse(raw)
  } catch {
    return new Response('', { status: 500 })
  }

  return new Response(parsed.content || '', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
