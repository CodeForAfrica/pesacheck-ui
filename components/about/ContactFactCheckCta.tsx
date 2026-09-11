import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/SectionHeading";
import { CONTACT_FACT_CHECK_CTA } from "@/lib/contact-content";

/** Matches the static copy's treatment, for a body authored in Superdesk. */
const PROSE = [
  "mt-6 text-lg italic leading-7 text-neutral-900 sm:text-xl",
  "[&_b]:font-bold [&_strong]:font-bold",
  "[&_a]:font-bold [&_a]:text-pesacheck-blue [&_a]:underline",
].join(" ");

/**
 * The closing call to send in a claim.
 *
 * Its copy is one sentence with the link set inside it, so an authored body
 * arrives as HTML rather than as text plus a button — the link is a phrase in
 * the sentence, and pulling it out would rewrite the design.
 */
export function ContactFactCheckCta({
  bodyHtml,
  bare = false,
}: {
  /** Sanitised HTML; without it the static sentence is rendered. */
  bodyHtml?: string;
  bare?: boolean;
} = {}) {
  const inner = (
    <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
      <Image
        src="/images/contact/fact-check-hand.png"
        alt=""
        width={120}
        height={120}
        className="size-[120px]"
      />
      {bodyHtml ? (
        // Sanitised in lib/data/body.ts:renderBody.
        <div
          className={PROSE}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized in renderBody
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      ) : (
        <p className="mt-6 text-lg italic leading-7 text-neutral-900 sm:text-xl">
          Do you <span className="font-bold">want us to fact-check</span>{" "}
          something a politician or other public figure has said about public
          finances?{" "}
          <Link
            href={CONTACT_FACT_CHECK_CTA.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-pesacheck-blue underline"
          >
            Complete this form
          </Link>
          , or reach out to us on any of the contacts above, and we&rsquo;ll
          help ensure you&rsquo;re not getting bamboozled.
        </p>
      )}
    </div>
  );

  if (bare) return inner;

  return <Container className="py-14 lg:py-[70px]">{inner}</Container>;
}
