import { getCookie, text, validAttemptId, readJsonKv } from "../_lib/key-system.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const cookie = request.headers.get("cookie") || "";
  const attemptId = getCookie(cookie, "xp_attempt");

  if (!validAttemptId(attemptId)) {
    return text("invalid or missing attempt", 400);
  }

  const attempt = await readJsonKv(env, `attempt:${attemptId}`);
  if (!attempt) {
    return text("attempt expired, return to the key system and try again", 400);
  }

  if (attempt.provider !== "lootlabs") {
    return text("provider mismatch", 403);
  }

  if (attempt.step !== "1" && attempt.step !== "2") {
    return text("invalid step", 400);
  }

  const redirectUrl = new URL(request.url);
  redirectUrl.pathname = `/key-system/${encodeURIComponent(attempt.hwid)}`;
  redirectUrl.search = `?returned=1&step=${encodeURIComponent(attempt.step)}&provider=lootlabs&script=${encodeURIComponent(attempt.script)}`;

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
