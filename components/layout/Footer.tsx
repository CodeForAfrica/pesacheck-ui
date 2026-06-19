import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import {
  FOOTER_ABOUT,
  FOOTER_NAV,
  LEGAL,
  SOCIAL_ICONS,
} from "@/lib/site";
import { FooterAllySection } from "@/components/layout/FooterAllySection";

export function Footer() {
  return (
    <footer className="mt-10 bg-neutral-50">
      <FooterAllySection />

      <Container className="pb-16">
        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-neutral-100 pt-10">
          <div className="flex items-center gap-4">
            <Image
              src="/images/header-logo/pesacheck-logo.png"
              alt="PesaCheck"
              width={190}
              height={39}
              className="h-[39px] w-auto mix-blend-exclusion"
            />
            <span className="text-xs font-medium text-neutral-500">An intitative of:</span>
            <Image
              src="/images/footer/cfa-logo-bw.svg"
              alt="Code for Africa"
              width={73}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          <Image
            src="/images/footer/image17.png"
            alt=""
            width={108}
            height={131}
            className="h-24 w-auto object-contain"
          />
        </div>

        <p className="mt-8 max-w-[610px] text-sm font-medium leading-5 text-neutral-900">
          {FOOTER_ABOUT}
        </p>

        <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-neutral-900">
          {FOOTER_NAV.map((l) => (
            <a key={l} href="#" className="transition-colors hover:text-pesacheck-blue">
              {l}
            </a>
          ))}
        </nav>

        <div className="mt-8 h-px w-full bg-neutral-100" />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-neutral-900">Follow PesaCheck on:</span>
            <div className="flex items-center gap-4">
              {SOCIAL_ICONS.map((s) => (
                <a key={s.name} href="#" aria-label={s.label}>
                  <Icon name={s.name} size={24} alt={s.label} />
                </a>
              ))}
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
