import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { ALLIES_DESCRIPTION, ALLIES_LOGOS } from "@/lib/partners-content";

export function AlliesSection() {
  return (
    <section className="py-14 lg:py-[70px]">
      <Container>
        <SectionHeading title="Our Allies" />
        <div className="mt-8 flex flex-col gap-4 text-sm font-medium leading-5 text-neutral-900 lg:max-w-[610px]">
          {ALLIES_DESCRIPTION.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-6">
          {ALLIES_LOGOS.map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              style={{
                height: "40px",
                width: `${Math.round((logo.width / logo.height) * 40)}px`,
              }}
              className="shrink-0 object-contain grayscale transition hover:grayscale-0"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
