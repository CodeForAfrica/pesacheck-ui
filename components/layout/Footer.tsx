import Image from "next/image";
import Link from "next/link";
import { FooterAllySection } from "@/components/layout/FooterAllySection";
import { Container } from "@/components/ui/SectionHeading";
import { FOOTER_ABOUT, FOOTER_NAV, LEGAL, SOCIAL_ICONS } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-white">
      <FooterAllySection />

      <Container className="pb-16">
        <div className="flex flex-wrap items-center justify-between gap-6 pt-10">
          <div className="flex items-end gap-4">
            <Image
              src="/pesacheck-logo.png"
              alt="PesaCheck"
              width={190}
              height={52}
              className="-ml-4 h-auto w-auto grayscale"
            />
            <span className="text-xs font-medium text-neutral-500">
              An intitative of:
            </span>
            <Image
              src="/images/footer/cfa-logo-bw.svg"
              alt="Code for Africa"
              width={73}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          <Image
            src="/images/footer/ifcn.png"
            alt="IFCN"
            width={108}
            height={131}
            className="h-24 w-auto object-contain grayscale"
          />
        </div>

        <p className="mt-8 max-w-[610px] text-sm font-medium leading-5 text-neutral-900">
          {FOOTER_ABOUT}
        </p>

        <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-neutral-900">
          {FOOTER_NAV.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="transition-colors hover:text-pesacheck-blue"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 h-px w-full bg-neutral-100" />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-neutral-900">
              Follow PesaCheck on:
            </span>
            <div className="flex items-center gap-4">
              {SOCIAL_ICONS.map((s) => {
                const SocialIcon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon size={24} aria-hidden />
                  </a>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-semibold text-neutral-900">
            {LEGAL.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
