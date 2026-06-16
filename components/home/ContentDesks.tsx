"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import { CONTENT_DESKS } from "@/lib/home-content";

export function ContentDesks() {
  const [active, setActive] = useState(1); // "Gender" is selected in the design

  return (
    <section id="knowledge" className="py-14 lg:py-20">
      <Container>
        <h2 className="text-2xl font-extrabold leading-10 text-gray-800 md:text-[30px]">
          Content Desks
        </h2>

        <div className="mt-8 flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CONTENT_DESKS.map((desk, i) => {
            const isActive = i === active;
            return (
              <button
                key={desk.name}
                type="button"
                onClick={() => setActive(i)}
                className="flex w-[160px] shrink-0 flex-col gap-2 text-left outline-none sm:w-[190px]"
              >
                <span className="relative h-[84px] w-full overflow-hidden rounded-lg">
                  <Image
                    src={desk.image}
                    alt={desk.name}
                    fill
                    sizes="190px"
                    className="object-cover"
                  />
                  {isActive && <span className="absolute inset-0 bg-pesacheck-blue/70" />}
                </span>
                <span
                  className={`text-base font-bold ${
                    isActive ? "text-pesacheck-blue" : "text-neutral-800"
                  }`}
                >
                  {desk.name}
                </span>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
