import { NextResponse } from "next/server";

/**
 * Contact form endpoint (issue #41). Validates the "Send us a message" payload,
 * verifies reCAPTCHA v3 (when configured), and forwards the message to a Slack
 * channel via an Incoming Webhook.
 *
 * Config (see .env.example):
 * - SLACK_CONTACT_WEBHOOK_URL   required — where submissions are posted
 * - RECAPTCHA_SECRET_KEY        optional — enables server-side captcha checks
 */

const SLACK_WEBHOOK = process.env.SLACK_CONTACT_WEBHOOK_URL;
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

// reCAPTCHA v3 returns a 0.0–1.0 score; below this we treat the request as a bot.
const SCORE_THRESHOLD = 0.7;
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

function slackMessage(p: Omit<ContactPayload, "recaptchaToken">) {
  return {
    text: `New contact message from ${p.fullName}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📥 New contact message",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Name:*\n${p.fullName}` },
          { type: "mrkdwn", text: `*Email:*\n<mailto:${p.email}|${p.email}>` },
          { type: "mrkdwn", text: `*Subject:*\n${p.subject}` },
        ],
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*Message:*\n${p.description}` },
      },
    ],
  };
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

  if (!SLACK_WEBHOOK) {
    console.error("SLACK_CONTACT_WEBHOOK_URL is not configured.");
    return NextResponse.json(
      {
        error: "Messaging is not configured. Please email hello@pesacheck.org.",
      },
      { status: 500 },
    );
  }

  let slackRes: Response;
  try {
    slackRes = await fetch(SLACK_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        slackMessage({ fullName, email, subject, description }),
      ),
    });
  } catch (err) {
    console.error("Slack webhook request failed:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 502 },
    );
  }

  if (!slackRes.ok) {
    console.error("Slack webhook returned", slackRes.status);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
