import { NextResponse } from "next/server";

/**
 * Newsletter signup endpoint (issue #43). Validates the email, verifies
 * reCAPTCHA v3 (when configured), and adds the contact to a Brevo list
 * (single opt-in) so PesaCheck can broadcast campaigns to them.
 *
 * Config (see .env.example):
 * - BREVO_API_KEY   required — Brevo API key
 * - BREVO_LIST_ID   required — numeric id of the target contact list
 * - RECAPTCHA_SECRET_KEY optional — enables server-side captcha checks
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = process.env.BREVO_LIST_ID;
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

const SCORE_THRESHOLD = 0.7;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscribePayload = {
  email: string;
  firstName?: string;
  recaptchaToken?: string;
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!token) return false;
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: RECAPTCHA_SECRET as string,
      response: token,
    }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean; score?: number };
  return Boolean(data.success) && (data.score ?? 0) >= SCORE_THRESHOLD;
}

export async function POST(req: Request) {
  let body: Partial<SubscribePayload>;
  try {
    body = (await req.json()) as Partial<SubscribePayload>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = str(body.email);
  const firstName = str(body.firstName);
  const recaptchaToken = str(body.recaptchaToken);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (firstName.length > 200) {
    return NextResponse.json({ error: "Name is too long." }, { status: 400 });
  }

  // Bot protection — only enforced when reCAPTCHA is configured.
  if (RECAPTCHA_SECRET) {
    const ok = await verifyRecaptcha(recaptchaToken);
    if (!ok) {
      return NextResponse.json(
        { error: "Captcha verification failed. Please try again." },
        { status: 400 },
      );
    }
  }

  if (!BREVO_API_KEY || !BREVO_LIST_ID) {
    console.error("BREVO_API_KEY / BREVO_LIST_ID is not configured.");
    return NextResponse.json(
      { error: "Newsletter signup is not configured." },
      { status: 500 },
    );
  }

  let res: Response;
  try {
    res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email,
        attributes: firstName ? { FIRSTNAME: firstName } : undefined,
        listIds: [Number(BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    });
  } catch (err) {
    console.error("Brevo request failed:", err);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 502 },
    );
  }

  // 201 = new contact created, 204 = existing contact updated (already on list).
  if (res.status === 201) {
    return NextResponse.json({ ok: true, alreadySubscribed: false });
  }
  if (res.status === 204) {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  const detail = (await res.json().catch(() => ({}))) as {
    code?: string;
    message?: string;
  };
  // Existing contact when updateEnabled is not honoured for some reason.
  if (detail.code === "duplicate_parameter") {
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  console.error("Brevo returned", res.status, detail);
  return NextResponse.json(
    { error: "Failed to subscribe. Please try again." },
    { status: 502 },
  );
}
