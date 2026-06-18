export async function onRequest(context) {
  const url = new URL(context.request.url)
  const auth = url.searchParams.get("auth")
  if (auth !== context.env.ADMIN_SECRET) return new Response("forbidden", { status: 403})
  const script = url.searchParams.get("script")
  if (!["spawner", "duper", "instasteal", "growagarden"].includes(script))
    return new Response("invalid script", { status: 400 })
  const days = parseInt(url.searchParams.get("days")) || 1
  const newkey = crypto.randomUUID().replace(/-/g, "")
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + days)
  await context.env.KEYS.put(newkey, JSON.stringify({expires: expiry.toISOString(), hwid: null, script}))
  return new Response(JSON.stringify({ key: newkey, expires: expiry.toISOString(), script}), {headers: { "Content-Type": "application/json" }})
}
