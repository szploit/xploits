    })
  }
  let body = null
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  const name = typeof body?.name === 'string' ? body.name : ''
  const content = typeof body?.content === 'string' ? body.content : ''
  if (!content.trim()) {
    return new Response(JSON.stringify({ error: 'Script content is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  let token = createToken()
  // Keep token unique.
  while (await env.SCRIPTS.get(token)) token = createToken()
  await env.SCRIPTS.put(
    token,
    JSON.stringify({
      name,
      content,
      createdAt: Date.now(),
    }),
  )
  const origin = new URL(request.url).origin
  return new Response(
    JSON.stringify({
      token,
      url: `${origin}/api/${token}/script`,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  )
}
