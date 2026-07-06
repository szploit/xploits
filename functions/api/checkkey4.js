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

  const ip = context.request.headers.get("CF-Connecting-IP") || "unknown"
  const ratKey = `rate4:${ip}`
  const ratRaw = await context.env.KEYS.get(ratKey)
  const attempts = ratRaw ? parseInt(ratRaw) : 0

  if (attempts >= 3)
    return new Response("rate_limited", { status: 429, headers: corsHeaders })

  await context.env.KEYS.put(ratKey, String(attempts + 1), { expirationTtl: 60 })

  let body
  try {
    body = await context.request.json()
  } catch {
    return new Response("invalid_body", { status: 400, headers: corsHeaders })
  }

  const { key, hwid, script, discordId } = body

  if (!key || !script)
    return new Response("invalid", { headers: corsHeaders })

  const raw = await context.env.KEYS.get(key)
  if (!raw) return new Response("invalid", { headers: corsHeaders })

  const data = JSON.parse(raw)

  if (new Date() > new Date(data.expires)) {
    await context.env.KEYS.delete(key)
    return new Response("expired", { headers: corsHeaders })
  }

  if (data.script !== script)
    return new Response("invalid", { headers: corsHeaders })

  if (hwid) {
    if (!data.hwid) {
      data.hwid = hwid
      data.lockedAt = new Date().toISOString()
    } else if (data.hwid !== hwid) {
      return new Response("hwid_mismatch", { headers: corsHeaders })
    }
  }

  if (data.discordId && data.discordId !== discordId)
    return new Response("already_redeemed", { headers: corsHeaders })

  if (!data.discordId && discordId)
    data.discordId = discordId

  await context.env.KEYS.put(key, JSON.stringify(data))
  return new Response("valid", { headers: corsHeaders })
}
