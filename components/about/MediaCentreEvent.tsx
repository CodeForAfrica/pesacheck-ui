import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import {
  EVENT,
  UPCOMING,
  UPCOMING_LABEL,
  type UpcomingEvent,
} from "@/lib/media-centre-content";

function UpcomingCard({ event }: { event: UpcomingEvent }) {
  return (
    <div className="flex flex-col">
      <p className="text-xs leading-[18px] text-neutral-500">{event.meta}</p>

      <div className="mt-3 flex flex-1 gap-3">
        <span className="mt-[9px] h-5 w-[3px] shrink-0 bg-pesacheck-black" />
        {/* The pill row sits at the bottom so it lines up across the three
            cards whatever depth their copy wraps to. */}
        <div className="flex min-w-0 flex-1 flex-col">
          <h4 className="text-xl font-bold leading-[30px] text-pesacheck-black">
            {event.title}
          </h4>
          <p className="mt-3 text-md font-medium leading-[26px] text-neutral-800">
            {event.body}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
            <span className="rounded-full border border-neutral-100 px-3.5 py-1 text-xs leading-[18px] text-neutral-600">
              {event.kind}
            </span>
            <a
              href={event.href}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-pesacheck-blue"
            >
              Details
              <FiArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MediaCentreEvent() {
  return (
    <section className="py-14 lg:py-16">
      <Container>
        <SectionHeading title="Event spotlight" />

        <div className="mt-9 grid gap-8 lg:grid-cols-[546px_1fr] lg:items-center lg:gap-11">
          <div className="relative aspect-[13/9] w-full overflow-hidden rounded-lg">
            <Image
              src={EVENT.image}
              alt={EVENT.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 546px"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-xs leading-[18px] text-[#8b9099]">
              {EVENT.meta}
            </p>
            <h3 className="mt-3 text-[26px] font-extrabold leading-[1.2] text-pesacheck-black sm:text-[30px]">
              {EVENT.title}
            </h3>
            <p className="mt-4 max-w-[510px] text-md font-medium leading-[26px] text-neutral-800">
              {EVENT.body}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {EVENT.details.map((detail) => (
                <div key={detail.label}>
                  <dt className="text-xs leading-[18px] text-neutral-500">
                    {detail.label}
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-neutral-800">
                    {detail.value}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href={EVENT.cta.href}
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-pesacheck-blue transition-colors hover:text-pesacheck-black"
            >
              {EVENT.cta.label}
              <FiArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
        </div>

        {/* Secondary listing: the same events treatment at a quarter of the
            weight, so the summit above keeps the section's attention. */}
        <h3 className="mt-12 text-sm font-bold uppercase tracking-wide text-neutral-600">
          {UPCOMING_LABEL}
        </h3>
        <div className="mt-5 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {UPCOMING.map((event) => (
            <UpcomingCard key={event.title} event={event} />
          ))}
        </div>
      </Container>
    </section>
  );
}
