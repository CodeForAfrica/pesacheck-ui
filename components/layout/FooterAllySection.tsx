"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiArrowUpRight } from "react-icons/fi";
import { Container } from "@/components/ui/SectionHeading";
import { ABOUT_BLURB, ALLIES, type Logo, PARTNERS } from "@/lib/site";

function LogoStrip({ logos }: { logos: Logo[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-8">
      {logos.map((logo) => (
        <Image
          key={logo.src}
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          style={{
            height: "48px",
            width: `${Math.round((logo.width / logo.height) * 48)}px`,
          }}
          className="shrink-0 object-contain grayscale"
        />
      ))}
    </div>
  );
}

function AllyColumn({ title, logos }: { title: string; logos: Logo[] }) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="h-10 w-[3px] shrink-0 rounded bg-pesacheck-black" />
        <h2 className="text-2xl font-extrabold leading-10 text-gray-800 md:text-[30px]">
          {title}
        </h2>
      </div>
      <div className="relative mt-5 h-px w-full bg-neutral-100">
        <span className="absolute left-0 top-0 h-px w-44 bg-pesacheck-black" />
      </div>
      <p className="mt-7 max-w-[505px] text-sm font-medium leading-5 text-neutral-900">
        {ABOUT_BLURB}
      </p>
      <a
        href="#"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-neutral-900"
      >
        Learn More
        <FiArrowUpRight size={20} aria-hidden />
      </a>
      <div className="mt-8">
        <LogoStrip logos={logos} />
      </div>
    </div>
  );
}

export function FooterAllySection() {
  const pathname = usePathname();
  if (pathname === "/about/partners") return null;

  return (
    <Container className="mt-10 py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <AllyColumn title="Our Allies" logos={ALLIES} />
        <AllyColumn title="Our Partners" logos={PARTNERS} />
      </div>
    </Container>
  );
}
