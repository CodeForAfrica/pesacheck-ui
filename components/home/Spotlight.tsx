import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { StoryCard } from "@/components/ui/StoryCard";
import {
  SPOTLIGHT_FEATURE,
  SPOTLIGHT_GRID,
  SPOTLIGHT_SECONDARY,
} from "@/lib/home-content";

export function Spotlight() {
  return (
    <section id="fact-checks" className="py-14 lg:py-20">
      <Container>
        <SectionHeading title="Spotlight" />

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StoryCard
              story={SPOTLIGHT_FEATURE}
              imageClassName="aspect-[330/220]"
              titleClassName="text-xl lg:text-2xl"
              showExcerpt
              horizontal
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 440px"
              priority
            />
          </div>
          <StoryCard
            story={SPOTLIGHT_SECONDARY}
            imageClassName="aspect-[400/203]"
            sizes="(max-width: 1024px) 100vw, 400px"
          />
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SPOTLIGHT_GRID.map((story) => (
            <StoryCard key={story.href ?? story.title} story={story} />
          ))}
        </div>
      </Container>
    </section>
  );
}
