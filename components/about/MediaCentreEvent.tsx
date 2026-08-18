import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { EVENT } from "@/lib/media-centre-content";

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
          </div>
        </div>
      </Container>
    </section>
  );
}
