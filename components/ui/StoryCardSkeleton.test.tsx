import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  StoryCardSkeleton,
  StoryGridSkeleton,
} from "@/components/ui/StoryCardSkeleton";

describe("StoryGridSkeleton", () => {
  it("renders the requested number of placeholder cards", () => {
    const html = renderToStaticMarkup(<StoryGridSkeleton count={8} />);
    // Each card is one pulsing block; the grid should match the page size so
    // the layout does not jump when results replace it.
    expect(html.match(/animate-pulse/g)).toHaveLength(8);
  });

  it("hides placeholders from assistive tech", () => {
    // They convey nothing — a screen reader should hear the results, not a
    // description of grey rectangles.
    const html = renderToStaticMarkup(<StoryCardSkeleton />);
    expect(html).toContain('aria-hidden="true"');
  });

  it("keeps the card's image ratio so the grid does not reflow", () => {
    const html = renderToStaticMarkup(
      <StoryCardSkeleton imageClassName="aspect-[330/220]" />,
    );
    expect(html).toContain("aspect-[330/220]");
  });

  it("adds excerpt lines only when the real card would show them", () => {
    const plain = renderToStaticMarkup(<StoryCardSkeleton />);
    const withExcerpt = renderToStaticMarkup(<StoryCardSkeleton showExcerpt />);
    expect(withExcerpt.length).toBeGreaterThan(plain.length);
  });
});
