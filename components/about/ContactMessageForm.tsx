"use client";

import Script from "next/script";
import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { toast } from "sonner";
import { CONTACT_FORM, type ContactField } from "@/lib/contact-content";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const RECAPTCHA_ACTION = "contact_submit";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

// Shared field shell: label + required asterisk above the control.
function Field({
  field,
  children,
}: {
  field: ContactField;
  children: React.ReactNode;
}) {
  return (
    <div className={field.span === "full" ? "sm:col-span-2" : ""}>
      <label
        htmlFor={field.name}
        className="flex gap-0.5 text-sm font-medium text-neutral-800"
      >
        {field.label}
        {field.required && <span className="text-[#fc0d1b]">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const CONTROL =
  "w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-500 focus:border-pesacheck-blue focus:outline-none";

function FormControl({ field }: { field: ContactField }) {
  if (field.type === "textarea") {
    return (
      <textarea
        id={field.name}
        name={field.name}
        placeholder={field.placeholder}
        required={field.required}
        rows={4}
        className={`${CONTROL} min-h-[104px] resize-none py-3`}
      />
    );
  }

  if (field.type === "select") {
    return (
      <div className="relative">
        <select
          id={field.name}
          name={field.name}
          defaultValue=""
          required={field.required}
          className={`${CONTROL} h-12 appearance-none pr-10 text-neutral-500`}
        >
          <option value="" disabled>
            {field.placeholder}
          </option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt} className="text-neutral-900">
              {opt}
            </option>
          ))}
        </select>
        <FiChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
          aria-hidden
        />
      </div>
    );
  }

  const FieldIcon = field.icon;
  return (
    <div className="relative flex h-12 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 focus-within:border-pesacheck-blue">
      {FieldIcon && <FieldIcon size={16} className="shrink-0" aria-hidden />}
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        placeholder={field.placeholder}
        required={field.required}
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
      />
    </div>
  );
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

export function ContactMessageForm() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    setSubmitting(true);
    try {
      const recaptchaToken = await getRecaptchaToken();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, recaptchaToken }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Failed to send your message.");
      }

      toast.success("Thanks! Your message has been sent.");
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
    <div className="rounded-xl border border-neutral-100 bg-white p-6 lg:p-7">
      {SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}
      <h3 className="text-xl font-semibold text-neutral-900">
        {CONTACT_FORM.heading}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        {CONTACT_FORM.fields.map((field) => (
          <Field key={field.name} field={field}>
            <FormControl field={field} />
          </Field>
        ))}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-pesacheck-blue px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-pesacheck-blue/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending…" : CONTACT_FORM.submitLabel}
          </button>
          {SITE_KEY && (
            <p className="mt-3 text-xs leading-4 text-neutral-500">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-700"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-700"
              >
                Terms of Service
              </a>{" "}
              apply.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
