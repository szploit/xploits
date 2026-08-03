export async function onRequestGet(context) {
  const { request, env } = context;
  const cookie = request.headers.get("cookie") || "";
  const attemptId = getCookieValue(cookie, "xp_attempt");

  if (!attemptId || !/^[a-f0-9]{32}$/.test(attemptId)) {
    return text("invalid or missing attempt", 400);
  }

  const attemptRaw = await env.KEYS.get(`attempt:${attemptId}`);

  if (!attemptRaw) {
    return text("attempt expired, return to the key system and try again", 400);
  }

  let attempt;

  try {
    attempt = JSON.parse(attemptRaw);
  } catch {
    return text("invalid attempt data", 500);
  }

  if (attempt.provider !== "lootlabs") {
    return text("provider mismatch", 403);
  }

  if (attempt.step !== "1" && attempt.step !== "2") {
    return text("invalid step", 400);
  }

  const redirectUrl = new URL(request.url);
  redirectUrl.pathname = `/key-system/${encodeURIComponent(attempt.hwid)}`;
  redirectUrl.search = `?returned=1&step=${encodeURIComponent(attempt.step)}&provider=lootlabs`;

  return new Response(null, {
    status: 302,
    headers: {
      "Location": redirectUrl.toString(),
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function onRequest(context) {
  return text("method not allowed", 405, { "Allow": "GET" });
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
