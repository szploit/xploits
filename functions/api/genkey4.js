export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }

  if (context.request.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders })

  if (context.request.method !== "POST")
    return new Response("method_not_allowed", { status: 405, headers: corsHeaders })

  let body
  try {
    body = await context.request.json()
  } catch {
    return new Response("invalid_body", { status: 400, headers: corsHeaders })
  }

  const { auth, days = 1, script = "sources" } = body

  if (auth !== context.env.ADMIN_SECRET)
    return new Response("forbidden", { status: 403, headers: corsHeaders })

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const newKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => chars[b % chars.length])
    .join("")

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
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } })
}
