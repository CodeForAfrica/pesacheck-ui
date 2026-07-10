import Image from "next/image";
import { FiMail, FiMapPin, FiPhoneCall } from "react-icons/fi";
import { ContactMessageForm } from "@/components/about/ContactMessageForm";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT_HQ, CONTACT_SOCIALS } from "@/lib/contact-content";

function ContactRow({
  icon: ContactIcon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-sm font-medium text-neutral-900">
      <ContactIcon size={24} className="mt-px shrink-0" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

export function ContactForm() {
  return (
    <Container className="py-14 lg:py-[70px]">
      <SectionHeading title={CONTACT_HQ.heading} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
        {/* Message form */}
        <ContactMessageForm />

        {/* Supporting photo */}
        <div className="relative aspect-[400/453] w-full overflow-hidden rounded-xl bg-neutral-100 lg:aspect-auto">
          <Image
            src="/images/contact/contact-form.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 400px"
            className="object-cover"
          />
        </div>
      </div>

      {/* HQ contact details */}
      <div className="mt-10 flex flex-col gap-3">
        <ContactRow icon={FiMapPin}>{CONTACT_HQ.address}</ContactRow>
        <ContactRow icon={FiMail}>{CONTACT_HQ.email}</ContactRow>
        <ContactRow icon={FiPhoneCall}>{CONTACT_HQ.phone}</ContactRow>

        <div className="mt-2 flex items-center gap-4">
          <span className="text-sm font-medium text-neutral-900">
            Follow Us:
          </span>
          <div className="flex items-center gap-3">
            {CONTACT_SOCIALS.map((social, i) => {
              const SocialIcon = social.icon;
              return (
                <div key={social.label} className="flex items-center gap-3">
                  {i > 0 && <span className="h-2.5 w-px bg-neutral-200" />}
                  <a href={social.href} aria-label={social.label}>
                    <SocialIcon size={24} color={social.color} aria-hidden />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Container>
  );
}
