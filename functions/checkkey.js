export async function onRequest(context) {
  const url = new URL(context.request.url);
  const key = url.searchParams.get("key");
  const corsheaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (context.request.method === "OPTIONS")
    return new Response(null, { headers: corsheaders });

  const ip = context.request.headers.get("CF-Connecting-IP") || "unknown";
  const ratkey = `rate:${ip}`;
  const ratraw = await context.env.KEYS.get(ratkey);
  const attempts = ratraw ? parseInt(ratraw) : 0;
  if (attempts >= 3) return new Response("rate_limited", { headers: corsheaders });
  await context.env.KEYS.put(ratkey, String(attempts + 1), { expirationTtl: 30 });

  if (!key) return new Response("invalid", { headers: corsheaders });

  const raw = await context.env.KEYS.get(key);
  if (!raw) return new Response("invalid", { headers: corsheaders });

  const data = JSON.parse(raw);
  if (new Date() > new Date(data.expires)) {
    await context.env.KEYS.delete(key);
    if (data.hwid) await context.env.KEYS.delete(`hwid:${data.hwid}`);
    return new Response("expired", { headers: corsheaders });
  }

  return new Response("valid", { headers: corsheaders });
}
