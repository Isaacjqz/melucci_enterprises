import { NextResponse } from "next/server";
import { inquirySchema } from "@/lib/inquiry";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Private Inquiry endpoint (§2a). POST-only; no CORS headers are set, so
 * browsers enforce same-origin. Input is validated/sanitized with Zod
 * server-side. No PII is ever logged. Honeypot submissions are silently
 * accepted but not delivered.
 */

// Explicit test stub: only ever set by the test runner, never in production.
const isTestMode = () => process.env.INQUIRY_TEST_MODE === "1";

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  if (!rateLimit(clientKey(req)).allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    // Field-level messages only — never echo submitted values back.
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (key !== "company" && !fields[key]) fields[key] = issue.message;
    }
    // A honeypot violation is not revealed as such.
    if (parsed.error.issues.some((i) => i.path[0] === "company")) {
      return NextResponse.json({
        ok: true,
        ...(isTestMode() ? { delivered: false } : {}),
      });
    }
    return NextResponse.json({ ok: false, fields }, { status: 400 });
  }

  const inquiry = parsed.data;

  if (isTestMode()) {
    return NextResponse.json({ ok: true, delivered: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("inquiry: missing email configuration (env)");
    return NextResponse.json(
      { ok: false, error: "This service is temporarily unavailable." },
      { status: 503 }
    );
  }

  const text = [
    `Name: ${inquiry.firstName} ${inquiry.lastName}`,
    `Email: ${inquiry.email}`,
    inquiry.phone ? `Phone: ${inquiry.phone}` : null,
    "",
    inquiry.message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: inquiry.email,
        subject: "Private inquiry — meluccienterprises.com",
        text,
      }),
    });
    if (!res.ok) {
      // Log status only — the response body could echo PII.
      console.error(`inquiry: delivery failed (status ${res.status})`);
      return NextResponse.json(
        { ok: false, error: "Your inquiry could not be sent. Please try again." },
        { status: 502 }
      );
    }
  } catch {
    console.error("inquiry: delivery failed (network)");
    return NextResponse.json(
      { ok: false, error: "Your inquiry could not be sent. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
