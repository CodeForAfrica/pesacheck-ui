import { NextResponse } from "next/server";

/**
 * Contact form endpoint (issue #41). Validates the "Send us a message" payload,
 * verifies reCAPTCHA v3 (when configured), and stores the submission as a row
 * in an Airtable base so PesaCheck has a trackable log of requests (status,
 * contact details, follow-up). Slack pings, if wanted, are configured natively
 * in Airtable rather than in code.
 *
 * Config (see .env.example):
 * - AIRTABLE_API_TOKEN   required — Airtable Personal Access Token
 * - AIRTABLE_BASE_ID     required — target base id (app…)
 * - AIRTABLE_TABLE_NAME  optional — table name (default "Contact Us")
 * - RECAPTCHA_SECRET_KEY optional — enables server-side captcha checks
 * - RECAPTCHA_SCORE_THRESHOLD optional — reject score below this (default 0.7)
 */

const AIRTABLE_TOKEN = process.env.AIRTABLE_API_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME ?? "Contact Us";
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

// reCAPTCHA v3 returns a 0.0–1.0 score; below this we treat the request as a bot.
// Configurable via env (RECAPTCHA_SCORE_THRESHOLD), defaulting to 0.7.
const rawScoreThreshold = process.env.RECAPTCHA_SCORE_THRESHOLD;
const parsedScoreThreshold = rawScoreThreshold
  ? Number(rawScoreThreshold)
  : NaN;
const SCORE_THRESHOLD = Number.isFinite(parsedScoreThreshold)
  ? parsedScoreThreshold
  : 0.7;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  fullName: string;
  email: string;
  subject: string;
  description: string;
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
  let body: Partial<ContactPayload>;
  try {
    body = (await req.json()) as Partial<ContactPayload>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const fullName = str(body.fullName);
  const email = str(body.email);
  const subject = str(body.subject);
  const description = str(body.description);
  const recaptchaToken = str(body.recaptchaToken);

  if (!fullName || !email || !subject || !description) {
    return NextResponse.json(
      { error: "Please fill in all fields." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (
    fullName.length > 200 ||
    subject.length > 200 ||
    description.length > 5000
  ) {
    return NextResponse.json({ error: "Input is too long." }, { status: 400 });
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

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
    console.error("AIRTABLE_API_TOKEN / AIRTABLE_BASE_ID is not configured.");
    return NextResponse.json(
      {
        error: "Messaging is not configured. Please email hello@pesacheck.org.",
      },
      { status: 500 },
    );
  }

  const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
    AIRTABLE_TABLE_NAME,
  )}`;

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      // typecast lets Airtable create the "New" single-select option if absent.
      body: JSON.stringify({
        typecast: true,
        records: [
          {
            fields: {
              Name: fullName,
              Email: email,
              Subject: subject,
              Message: description,
              Status: "New",
            },
          },
        ],
      }),
    });
  } catch (err) {
    console.error("Airtable request failed:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Airtable returned", res.status, detail);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
