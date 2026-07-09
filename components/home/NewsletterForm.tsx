"use client";

import Script from "next/script";
import { useState } from "react";
import { toast } from "sonner";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const RECAPTCHA_ACTION = "newsletter_subscribe";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

async function getRecaptchaToken(): Promise<string | undefined> {
  if (!SITE_KEY || !window.grecaptcha) return undefined;
  const grecaptcha = window.grecaptcha;
  return new Promise((resolve) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute(SITE_KEY, { action: RECAPTCHA_ACTION })
        .then(resolve)
        .catch(() => resolve(undefined));
    });
  });
}

const INPUT =
  "h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-500 focus:border-pesacheck-blue focus:outline-none";

export function NewsletterForm() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setSubmitting(true);
    try {
      const recaptchaToken = await getRecaptchaToken();
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });

      const result = (await res.json().catch(() => ({}))) as {
        error?: string;
        alreadySubscribed?: boolean;
      };

      if (!res.ok) {
        throw new Error(result.error ?? "Failed to subscribe.");
      }

      toast.success(
        result.alreadySubscribed
          ? "You're already subscribed — thanks!"
          : "Thanks for subscribing!",
      );
      form.reset();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2.5">
      {SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}
      <label htmlFor="newsletter-firstName" className="sr-only">
        First name
      </label>
      <input
        id="newsletter-firstName"
        name="firstName"
        type="text"
        autoComplete="given-name"
        placeholder="First name"
        className={INPUT}
      />
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          className={INPUT}
        />
        <button
          type="submit"
          disabled={submitting}
          className="shrink-0 rounded-lg bg-pesacheck-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-pesacheck-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "…" : "Subscribe"}
        </button>
      </div>
      {SITE_KEY && (
        <p className="text-xs leading-4 text-neutral-500">
          Protected by reCAPTCHA —{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-neutral-700"
          >
            Privacy
          </a>{" "}
          &{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-neutral-700"
          >
            Terms
          </a>
          .
        </p>
      )}
    </form>
  );
}
