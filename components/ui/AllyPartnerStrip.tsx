import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { Container } from "@/components/ui/SectionHeading";
import { ABOUT_BLURB, ALLIES, type Logo, PARTNERS } from "@/lib/site";

function LogoStrip({ logos }: { logos: Logo[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-8">
      {logos.map((logo) => (
        <Link
          key={logo.src}
          href={logo.href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            // Normalised to a common height so logos of different aspect
            // ratios sit on one line without one dwarfing the rest.
            style={{
              height: "48px",
              width: `${Math.round((logo.width / logo.height) * 48)}px`,
            }}
            className="object-contain grayscale transition hover:grayscale-0"
          />
        </Link>
      ))}
    </div>
  );
}

function Column({
  title,
  blurb,
  logos,
}: {
  title: string;
  blurb: string;
  logos: Logo[];
}) {
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
        {blurb}
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

/**
 * The two-column allies and partners strip.
 *
 * Shared between the footer, which renders it on most pages, and the
 * `ally-partner-strip` section template, so a page can place it deliberately.
 * Both read the same two lists — there is one set of allies, not one per
 * surface.
 */
export function AllyPartnerStrip({
  allies = ALLIES,
  partners = PARTNERS,
  blurb,
  bare = false,
}: {
  allies?: Logo[];
  partners?: Logo[];
  /** Standfirst repeated in both columns; a placed section can override it. */
  blurb?: string;
  bare?: boolean;
}) {
  const copy = blurb?.trim() || ABOUT_BLURB;

  const inner = (
    <div className="grid gap-12 lg:grid-cols-2">
      <Column title="Our Allies" blurb={copy} logos={allies} />
      <Column title="Our Partners" blurb={copy} logos={partners} />
    </div>
  );

  if (bare) return inner;

  return (
    <section style={{ background: "var(--Neutral-50, #F6F7F8)" }}>
      <Container className="mt-10 py-16">{inner}</Container>
    </section>
  );
}
