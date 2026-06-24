import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { StoryCard } from "@/components/ui/StoryCard";
import { LATEST_FEATURE, LATEST_GRID } from "@/lib/home-content";

export function LatestStories() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <SectionHeading title="Latest Stories" />

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StoryCard
              story={LATEST_FEATURE}
              imageClassName="aspect-[330/220]"
              titleClassName="text-xl lg:text-2xl"
              showExcerpt
              horizontal
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 440px"
            />
          </div>
          <StoryCard story={LATEST_GRID[0]} imageClassName="aspect-[400/203]" />
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {LATEST_GRID.slice(1).map((story) => (
            <StoryCard key={story.href ?? story.title} story={story} />
          ))}
        </div>
      </Container>
    </section>
  );
}
