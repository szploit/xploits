export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  const cookieAttemptId = getCookieValue(cookie, "xp_attempt");
  const queryAttemptId = url.searchParams.get("attempt");
  const attemptId = cookieAttemptId;
  const hash = url.searchParams.get("hash");

  if (!attemptId || !/^[a-f0-9]{32}$/.test(attemptId)) {
    return text("invalid attempt", 400);
  }

  if (queryAttemptId && queryAttemptId !== cookieAttemptId) {
    return text("attempt mismatch", 403);
  }

  if (!hash || typeof hash !== "string" || hash.length > 256) {
    return text("invalid hash", 400);
  }

  const attemptRaw = await env.KEYS.get(`attempt:${attemptId}`);

  if (!attemptRaw) {
    return text("invalid or expired attempt", 400);
  }

  let attempt;

  try {
    attempt = JSON.parse(attemptRaw);
  } catch {
    return text("invalid attempt data", 500);
  }

  if (attempt.status !== "pending") {
    return text("attempt already processed", 409);
  }

  if (attempt.provider !== "linkvertise") {
    return text("provider mismatch", 403);
  }

  if (attempt.step !== "1" && attempt.step !== "2") {
    return text("invalid step", 400);
  }

  const startedAt = Number(attempt.startedAt);
  const now = Date.now();

  if (!Number.isSafeInteger(startedAt) || startedAt <= 0 || now < startedAt) {
    return text("invalid attempt time", 400);
  }

  if (now - startedAt > 900000) {
    await env.KEYS.delete(`attempt:${attemptId}`);
    return text("attempt expired", 403);
  }

  const currentAttemptId = await env.KEYS.get(`current_attempt:${attempt.hwid}:${attempt.step}`);

  if (currentAttemptId !== attemptId) {
    return text("attempt is no longer current", 409);
  }

  const hashDigest = await sha256(hash);
  const usedHashKey = `used-linkvertise-hash:${hashDigest}`;
  const usedHash = await env.KEYS.get(usedHashKey);

  if (usedHash) {
    return text("hash already used", 409);
  }

  const verifyUrl = new URL("https://publisher.linkvertise.com/api/v1/anti_bypassing");
  verifyUrl.searchParams.set("token", env.LINKVERTISE_AUTH_TOKEN);
  verifyUrl.searchParams.set("hash", hash);

  let verifyResponse;

  try {
    verifyResponse = await fetch(verifyUrl.toString(), { method: "POST", headers: { "Accept": "application/json" } });
  } catch {
    return text("Linkvertise verification unavailable", 502);
  }

  if (!verifyResponse.ok) {
    return text("Linkvertise verification rejected", 403);
  }

  let verifyData;

  try {
    verifyData = await verifyResponse.json();
  } catch {
    return text("invalid Linkvertise response", 502);
  }

  if (verifyData.status !== true) {
    return text("Linkvertise verification failed", 403);
  }

  const usedAfterVerification = await env.KEYS.get(usedHashKey);

  if (usedAfterVerification) {
    return text("hash already used", 409);
  }

  attempt.status = "completed";
  attempt.completedAt = Date.now();
  attempt.linkvertiseHashDigest = hashDigest;

  await env.KEYS.put(usedHashKey, attemptId, { expirationTtl: 900 });
  await env.KEYS.put(`attempt:${attemptId}`, JSON.stringify(attempt), { expirationTtl: 900 });

  const redirectUrl = new URL(request.url);
  redirectUrl.pathname = `/key-system/${encodeURIComponent(attempt.hwid)}`;
  redirectUrl.search = `?returned=1&step=${encodeURIComponent(attempt.step)}&provider=linkvertise`;

  return new Response(null, {
    status: 302,
    headers: {
      "Location": redirectUrl.toString(),
      "Set-Cookie": "xp_attempt=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function onRequest(context) {
  return text("method not allowed", 405, { "Allow": "GET" });
}

async function sha256(value) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

function getCookieValue(cookieHeader, name) {
  const cookies = cookieHeader.split(";");

  for (const rawCookie of cookies) {
    const cookie = rawCookie.trim();

    if (cookie.startsWith(`${name}=`)) {
      try {
        return decodeURIComponent(cookie.slice(name.length + 1));
      } catch {
        return null;
      }
    }
  }

  return null;
}

function text(message, status = 200, extraHeaders = {}) {
  return new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", ...extraHeaders } });
}
