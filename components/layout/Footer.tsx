import Image from "next/image";
import Link from "next/link";
import { FooterAllySection } from "@/components/layout/FooterAllySection";
import { Container } from "@/components/ui/SectionHeading";
import type { FooterLink } from "@/lib/data/navigation";
import {
  FOOTER_ABOUT,
  FOOTER_NAV,
  LEGAL,
  type Logo,
  SOCIAL_ICONS,
} from "@/lib/site";

export function Footer({
  navLinks = FOOTER_NAV,
  legalLinks = LEGAL,
  allies,
  partners,
}: {
  navLinks?: FooterLink[];
  legalLinks?: FooterLink[];
  allies?: Logo[];
  partners?: Logo[];
} = {}) {
  return (
    <footer className="bg-white">
      <FooterAllySection allies={allies} partners={partners} />

      <Container className="pb-16">
        <div className="flex flex-wrap items-start justify-between gap-6 pt-10">
          {/* Masthead and blurb share a column so the IFCN badge sits beside
              them rather than pushing the blurb below its full height. */}
          <div>
            <div className="flex items-center gap-4">
              <Image
                src="/pesacheck-logo.png"
                alt="PesaCheck"
                width={190}
                height={52}
                className="-ml-4 h-auto w-auto grayscale transition hover:grayscale-0"
              />
              <span className="text-xs font-medium text-neutral-500">
                An initiative of:
              </span>
              <Link
                href="https://codeforafrica.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold"
              >
                <span className="text-[#0d0d0d]">Code for </span>
                <span className="text-[#0049a7]">Africa</span>
              </Link>
            </div>

            <p className="max-w-[610px] text-sm font-medium leading-5 text-[#5f656c]">
              {FOOTER_ABOUT}
            </p>
          </div>

          <Image
            src="/images/footer/ifcn.png"
            alt="IFCN"
            width={108}
            height={131}
            className="h-[131px] w-[108px] object-contain grayscale transition hover:grayscale-0"
          />
        </div>

        <div className="mt-8 h-px w-full bg-neutral-100" />

        <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-neutral-900">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="transition-colors hover:text-pesacheck-blue"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 h-px w-full bg-neutral-100" />

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
            <span>Copyright {new Date().getFullYear()} PesaCheck</span>
            {legalLinks.map((item) => {
              const external = item.href.startsWith("http");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="transition-colors hover:text-pesacheck-blue"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </footer>
  );
}
