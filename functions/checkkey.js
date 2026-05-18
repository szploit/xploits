export async function onRequest(context) {
  const url = new URL(context.request.url)
  const key = url.searchParams.get("key")
  const hwid = url.searchParams.get("hwid")

  if (!key || !hwid) return new Response("invalid")

  const raw = await context.env.KEYS.get(key)
  if (!raw) return new Response("invalid")

  const data = JSON.parse(raw)

  if (new Date() > new Date(data.expires)) {
    await context.env.KEYS.delete(key)
    return new Response("expired")
  }

  if (!data.hwid) {
    data.hwid = hwid
    await context.env.KEYS.put(key, JSON.stringify(data))
    return new Response("valid")
  }

  if (data.hwid !== hwid) return new Response("hwid_mismatch")

  return new Response("valid")
}
