import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { PARTNERS_DESCRIPTION, PARTNERS_LOGOS } from "@/lib/partners-content";

export function OurPartnersSection() {
  return (
    <section className="bg-neutral-50 py-14 lg:py-[70px]">
      <Container>
        <SectionHeading title="Our Partners" />
        <div className="mt-8 flex flex-col gap-4 text-sm font-medium leading-5 text-neutral-900 lg:max-w-[610px]">
          {PARTNERS_DESCRIPTION.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-6">
          {PARTNERS_LOGOS.map((logo) => (
            <div
              key={logo.alt}
              className="relative grayscale transition hover:grayscale-0"
              style={{ width: logo.width, height: logo.height }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
