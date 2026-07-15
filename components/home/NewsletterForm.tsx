/**
 * Newsletter signup (issue #43). A styled version of the Mailchimp/MailerLite
 * embed form: a plain HTML form that POSTs directly to the hosted endpoint
 * (opens the provider's confirmation page in a new tab). Field names — EMAIL,
 * MMERGE3 (first name), MMERGE2 (last name), MMERGE6 (organisation) — and the
 * hidden anti-bot honeypot are kept exactly as the embed requires.
 */

const ACTION_URL = "https://landing.mailerlite.com/webforms/landing/w6s4e5";
// Hidden honeypot from the embed — real users leave it empty; bots fill it.
const HONEYPOT_NAME = "b_500c9d96ac4537a15edfc1557_bada8e4aa1";

const INPUT =
  "h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-500 focus:border-pesacheck-blue focus:outline-none";

export function NewsletterForm() {
  return (
    <form
      action={ACTION_URL}
      method="post"
      target="_blank"
      className="flex w-full flex-col gap-2.5"
      rel="noopener"
    >
      <label htmlFor="mce-EMAIL" className="sr-only">
        Email address (required)
      </label>
      <input
        id="mce-EMAIL"
        name="EMAIL"
        type="email"
        required
        autoComplete="email"
        placeholder="Email address *"
        className={INPUT}
      />

      <div className="flex gap-2.5">
        <div className="flex-1">
          <label htmlFor="mce-MMERGE3" className="sr-only">
            First name
          </label>
          <input
            id="mce-MMERGE3"
            name="MMERGE3"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            className={INPUT}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="mce-MMERGE2" className="sr-only">
            Last name
          </label>
          <input
            id="mce-MMERGE2"
            name="MMERGE2"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            className={INPUT}
          />
        </div>
      </div>

      <label htmlFor="mce-MMERGE6" className="sr-only">
        Organisation
      </label>
      <input
        id="mce-MMERGE6"
        name="MMERGE6"
        type="text"
        autoComplete="organization"
        placeholder="Organisation"
        className={INPUT}
      />

      {/* Honeypot — visually hidden, off the tab order. Do not remove. */}
      <div className="absolute -left-[5000px]" aria-hidden="true">
        <input
          type="text"
          name={HONEYPOT_NAME}
          tabIndex={-1}
          defaultValue=""
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        name="subscribe"
        className="mt-0.5 rounded-lg bg-pesacheck-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pesacheck-blue/90"
      >
        Subscribe
      </button>
    </form>
  );
}
