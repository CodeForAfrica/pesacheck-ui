import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { StoryCard } from "@/components/ui/StoryCard";
import {
  SPOTLIGHT_FEATURE,
  SPOTLIGHT_GRID,
  SPOTLIGHT_SECONDARY,
  type Story,
} from "@/lib/home-content";

// Static fallback: a flat list in layout order (feature, secondary, …grid).
const SPOTLIGHT_FALLBACK: Story[] = [
  SPOTLIGHT_FEATURE,
  SPOTLIGHT_SECONDARY,
  ...SPOTLIGHT_GRID,
];

export function Spotlight({
  stories = SPOTLIGHT_FALLBACK,
}: {
  stories?: Story[];
}) {
  const [feature, secondary, ...grid] = stories;

  return (
    <section
      id="fact-checks"
      className="py-14 lg:py-20"
      style={{ background: "var(--Neutral-50, #F6F7F8)" }}
    >
      <Container>
        <SectionHeading title="Spotlight" />

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StoryCard
              story={feature}
              imageClassName="aspect-[330/220]"
              titleClassName="text-xl lg:text-2xl"
              showExcerpt
              horizontal
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 440px"
              priority
            />
          </div>
          {secondary && (
            <StoryCard
              story={secondary}
              imageClassName="aspect-[400/203]"
              sizes="(max-width: 1024px) 100vw, 400px"
            />
          )}
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {grid.map((story) => (
            <StoryCard key={story.href ?? story.title} story={story} />
          ))}
        </div>
      </Container>
    </section>
  );
}
