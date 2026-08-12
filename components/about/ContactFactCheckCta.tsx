import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/SectionHeading";
import { CONTACT_FACT_CHECK_CTA } from "@/lib/contact-content";

export function ContactFactCheckCta() {
  return (
    <Container className="py-14 lg:py-[70px]">
      <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
        <Image
          src="/images/contact/fact-check-hand.png"
          alt=""
          width={120}
          height={120}
          className="size-[120px]"
        />
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
      </div>
    </Container>
  );
}
