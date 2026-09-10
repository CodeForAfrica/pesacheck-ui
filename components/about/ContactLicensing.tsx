import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT_LICENSING } from "@/lib/contact-content";

export function ContactLicensing() {
  return (
    <Container className="py-14 lg:py-[70px]">
      <SectionHeading title={CONTACT_LICENSING.heading} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,610px)_1fr] lg:gap-12">
        <div className="text-sm font-medium leading-5 text-neutral-900">
          {/* The imprint moved to its own page, which the footer links to
              — keeping a copy here would leave two, one of them uneditable. */}
          <p>{CONTACT_LICENSING.body}</p>
        </div>

        {/* Image placeholder */}
        <div
          className="aspect-[505/574] w-full rounded-xl bg-neutral-100"
          aria-hidden="true"
        />
      </div>
    </Container>
  );
}
