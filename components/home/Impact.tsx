import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { IMPACT_STATS } from "@/lib/home-content";

export function Impact() {
  return (
    <section id="about" className="py-14 lg:py-20">
      <Container>
        <SectionHeading title="Our Impact" />
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative aspect-square w-full">
            <Image
              src="/images/impact/africa-map.png"
              alt="Map of Africa showing PesaCheck coverage"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col gap-5">
            {IMPACT_STATS.map((stat) => (
              <div
                key={stat.value}
                className="rounded-xl border border-neutral-100 bg-neutral-50 p-6"
              >
                <p className="text-xl font-extrabold text-pesacheck-blue">{stat.value}</p>
                <p className="mt-2 text-sm font-medium leading-5 text-neutral-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
