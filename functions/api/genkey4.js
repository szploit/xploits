export async function onRequest(context) {
  if (context.request.method !== "POST")
    return new Response("method_not_allowed", { status: 405 })

  let body
  try {
    body = await context.request.json()
  } catch {
    return new Response("invalid_body", { status: 400 })
  }

  const { auth, days = 1, script = "sources" } = body

  if (auth !== context.env.ADMIN_SECRET)
    return new Response("forbidden", { status: 403 })

  const uuid = crypto.randomUUID().toUpperCase()
  const newKey = uuid
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + days)

  await context.env.KEYS.put(newKey, JSON.stringify({
    expires: expiry.toISOString(),
    hwid: null,
    discordId: null,
    lockedAt: null,
    script,
    system: "v4"
  }))

  return new Response(JSON.stringify({
    key: newKey,
    expires: expiry.toISOString(),
    script,
    days
  }), { headers: { "Content-Type": "application/json" } })
}
