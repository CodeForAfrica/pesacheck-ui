import Image from "next/image";
import { Container } from "@/components/ui/SectionHeading";
import { DateRow } from "@/components/ui/MetaRow";
import { HERO, HERO_PREVIEW } from "@/lib/fact-checks-content";
import type { Story } from "@/lib/home-content";

// Left-to-right scrim so the white title stays legible over the illustration.
const HERO_GRADIENT =
  "linear-gradient(100.768deg, rgba(4, 26, 109, 0.92) 40%, rgba(4, 26, 109, 0) 70%)";

function PreviewCard({ story }: { story: Story }) {
  return (
    <a
      href={story.href ?? "#"}
      className="flex h-[160px] w-[320px] shrink-0 snap-start items-start gap-4 rounded-[10px] border-[0.5px] border-white/80 bg-white/70 p-[15px] backdrop-blur-[5px] sm:w-[400px]"
    >
      <div className="relative size-[130px] shrink-0 overflow-hidden rounded-2xl">
        <Image src={story.image} alt={story.alt} fill sizes="130px" className="object-cover" />
      </div>
      <div className="flex h-full flex-col justify-between py-1">
        <p className="text-sm font-bold leading-5 text-gray-800">{story.title}</p>
        <DateRow date={story.date} readTime={story.readTime} />
      </div>
    </a>
  );
}

export function FactChecksHero() {
  return (
    <section className="relative overflow-hidden bg-pesacheck-black">
      <Image
        src="/images/fact-checks/hero-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0" style={{ backgroundImage: HERO_GRADIENT }} />

      <Container className="relative flex min-h-[480px] flex-col justify-end py-14 lg:min-h-[550px] lg:py-16">
        <div>
          <span className="mb-5 block h-[3px] w-[190px] rounded bg-white/80" />
          <h1 className="text-[34px] font-extrabold leading-[1.18] text-white sm:text-[44px] lg:text-[52px]">
            {HERO.topic}
          </h1>
        </div>

        {/* Recent fact-checks carousel */}
        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {HERO_PREVIEW.map((story, i) => (
            <PreviewCard key={i} story={story} />
          ))}
        </div>
      </Container>
    </section>
  );
}
