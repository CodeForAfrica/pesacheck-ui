import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { ShowMoreLink } from "@/components/ui/ShowMoreLink";
import { StoryCard } from "@/components/ui/StoryCard";
import {
  LATEST_FEATURE,
  LATEST_GRID,
  LATEST_GRID_LIMIT,
  type Story,
} from "@/lib/home-content";

// Static fallback: a flat list in layout order (feature, secondary, …grid).
const LATEST_FALLBACK: Story[] = [LATEST_FEATURE, ...LATEST_GRID];

export function LatestStories({
  stories = LATEST_FALLBACK,
  gridLimit = LATEST_GRID_LIMIT,
}: {
  stories?: Story[];
  gridLimit?: number;
}) {
  const [feature, secondary, ...rest] = stories;
  const grid = rest.slice(0, gridLimit);

  return (
    <section
      className="py-14 lg:py-20"
      style={{ background: "var(--Neutral-50, #F6F7F8)" }}
    >
      <Container>
        <SectionHeading title="Latest Stories" />

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StoryCard
              story={feature}
              imageClassName="aspect-[330/220]"
              titleClassName="text-xl lg:text-2xl"
              showExcerpt
              horizontal
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 440px"
            />
          </div>
          {secondary && (
            <StoryCard story={secondary} imageClassName="aspect-[400/203]" />
          )}
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((story) => (
            <StoryCard key={story.href ?? story.title} story={story} />
          ))}
        </div>

        <div className="mt-7 flex justify-end">
          <ShowMoreLink href="/fact-checks" />
        </div>
      </Container>
    </section>
  );
}
