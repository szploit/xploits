export async function onRequest(context) {
  const url = new URL(context.request.url);
  const key = url.searchParams.get("key");
  const hwid = url.searchParams.get("hwid");
  const script = url.searchParams.get("script");
  const discordId = url.searchParams.get("discordid");
  const corsheaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (context.request.method === "OPTIONS")
    return new Response(null, { headers: corsheaders });

  const ip = context.request.headers.get("CF-Connecting-IP") || "unknown";
  const ratKey = `rate2:${ip}`;
  const ratRaw = await context.env.KEYS.get(ratKey);
  const attempts = ratRaw ? parseInt(ratRaw) : 0;
  if (attempts >= 3) return new Response("rate_limited", { headers: corsheaders });
  await context.env.KEYS.put(ratKey, String(attempts + 1), { expirationTtl: 60 });

  if (!key || !script) return new Response("invalid", { headers: corsheaders });

  const raw = await context.env.KEYS.get(key);
  if (!raw) return new Response("invalid", { headers: corsheaders });

  const data = JSON.parse(raw);

  if (new Date() > new Date(data.expires)) {
    await context.env.KEYS.delete(key);
    return new Response("expired", { headers: corsheaders });
  }

  if (data.script !== script)
    return new Response("invalid", { headers: corsheaders });

  if (hwid) {
    if (!data.hwid) {
      data.hwid = hwid;
      await context.env.KEYS.put(key, JSON.stringify(data));
    } else if (data.hwid !== hwid) {
      return new Response("hwid_mismatch", { headers: corsheaders });
    }
  }

  if (data.discordId && data.discordId !== discordId)
    return new Response("already_redeemed", { headers: corsheaders });
  if (!data.discordId && discordId) {
    data.discordId = discordId;
    await context.env.KEYS.put(key, JSON.stringify(data));
  }

  return new Response("valid", { headers: corsheaders });
}
