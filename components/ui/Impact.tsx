import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { IMPACT_STATS } from "@/lib/site";

export function Impact() {
  return (
    <section id="our-impact" className="bg-neutral-50 py-14 lg:py-20">
      <Container>
        <SectionHeading title="Our Impact" />
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_610px]">
          {/* Africa coverage map */}
          <div className="relative mx-auto aspect-square w-full max-w-[504px]">
            <Image
              src="/images/impact/africa-map.png"
              alt="Map of Africa showing PesaCheck coverage"
              fill
              sizes="(max-width: 1024px) 100vw, 504px"
              className="object-contain"
            />
          </div>

          {/* 2x2 stat cards */}
          <div className="grid gap-5 sm:grid-cols-2">
            {IMPACT_STATS.map((stat) => (
              <div
                key={stat.value}
                className="rounded-xl border border-neutral-100 bg-pesacheck-white p-7"
              >
                <span className="flex size-[38px] items-center justify-center rounded-full bg-primary-50">
                  <Icon name={stat.icon} size={18} />
                </span>
                <p className="mt-5 text-base font-bold leading-6 text-neutral-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium leading-5 text-neutral-600">
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
