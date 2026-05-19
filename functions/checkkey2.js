export async function onRequest(context) {
  const url = new URL(context.request.url)
  const key = url.searchParams.get("key")
  const hwid = url.searchParams.get("hwid")

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }

  if (context.request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  if (!key || !hwid) return new Response("invalid", { headers: corsHeaders })
  if (!key.startsWith("LUA-")) return new Response("invalid", { headers: corsHeaders })

  const raw = await context.env.KEYS.get(key)
  if (!raw) return new Response("invalid", { headers: corsHeaders })

  const data = JSON.parse(raw)

  if (new Date() > new Date(data.expires)) {
    await context.env.KEYS.delete(key)
    return new Response("expired", { headers: corsHeaders })
  }

  if (!data.hwid) {
    data.hwid = hwid
    await context.env.KEYS.put(key, JSON.stringify(data))
    return new Response("valid", { headers: corsHeaders })
  }

  if (data.hwid !== hwid) return new Response("hwid_mismatch", { headers: corsHeaders })

  return new Response("valid", { headers: corsHeaders })
}
