export async function onRequest(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
  }

  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  if (context.request.method !== "POST") {
    return new Response("method_not_allowed", {
      status: 405,
      headers: corsHeaders,
    })
  }

  const ip =
    context.request.headers.get("CF-Connecting-IP") || "unknown"

  const rateKey = `rate4:${ip}`
  const maxInvalidAttempts = 3
  const rateLimitSeconds = 60

  async function failedValidation(message) {
    const rawAttempts = await context.env.KEYS.get(rateKey)
    const attempts = rawAttempts
      ? Number.parseInt(rawAttempts, 10)
      : 0

    if (attempts >= maxInvalidAttempts) {
      return new Response("rate_limited", {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain; charset=utf-8",
          "Retry-After": String(rateLimitSeconds),
        },
      })
    }

    await context.env.KEYS.put(
      rateKey,
      String(attempts + 1),
      { expirationTtl: rateLimitSeconds }
    )

    return new Response(message, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  }

  let body

  try {
    body = await context.request.json()
  } catch {
    return failedValidation("invalid_body")
  }

  const { key, hwid, script, discordId } = body

  if (
    typeof key !== "string" ||
    typeof script !== "string" ||
    key.length === 0 ||
    script.length === 0
  ) {
    return failedValidation("invalid")
  }

  const raw = await context.env.KEYS.get(key)

  if (!raw) {
    return failedValidation("invalid")
  }

  let data

  try {
    data = JSON.parse(raw)
  } catch {
    return new Response("service_error", {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  }

  if (!data.expires || new Date() > new Date(data.expires)) {
    await context.env.KEYS.delete(key)
    return failedValidation("expired")
  }

  if (data.script !== script) {
    return failedValidation("invalid")
  }

  if (hwid) {
    if (!data.hwid) {
      data.hwid = hwid
      data.lockedAt = new Date().toISOString()
    } else if (data.hwid !== hwid) {
      return failedValidation("hwid_mismatch")
    }
  }

  if (data.discordId && data.discordId !== discordId) {
    return failedValidation("already_redeemed")
  }

  if (!data.discordId && discordId) {
    data.discordId = discordId
  }

  await context.env.KEYS.put(key, JSON.stringify(data))

  return new Response(
    JSON.stringify({
      status: "valid",
      expires: data.expires,
    }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  )
}
