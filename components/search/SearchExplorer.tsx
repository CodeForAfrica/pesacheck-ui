import { PaginationNav } from "@/components/ui/PaginationNav";
import { Container } from "@/components/ui/SectionHeading";
import { StoryCard } from "@/components/ui/StoryCard";
import {
  type FilterOptions,
  type FilterSelection,
  hasActiveFilters,
  selectedFilterLabels,
} from "@/lib/data/fact-check-filters";
import type { FactCheckListing } from "@/lib/data/stories";
import type { Story } from "@/lib/home-content";

function SearchIllustration() {
  return (
    <div className="relative h-[128px] w-[172px]">
      {/* Background circle */}
      <div className="absolute left-[22px] top-0 size-[128px] rounded-full bg-neutral-100" />
      {/* Small decorative circles */}
      <div className="absolute left-[14px] top-[14px] size-3 rounded-full bg-neutral-200" />
      <div className="absolute bottom-[10px] left-[9px] size-4 rounded-full bg-neutral-200" />
      <div className="absolute right-[6px] top-[28px] size-4 rounded-full bg-neutral-200" />
      <div className="absolute right-[14px] top-1 size-[10px] rounded-full bg-neutral-300" />
      {/* Cloud shape (simplified) */}
      <svg
        className="absolute left-[16px] top-[16px]"
        width="140"
        height="80"
        viewBox="0 0 140 80"
        fill="none"
        aria-hidden
      >
        <path
          d="M110 55H30a20 20 0 0 1 0-40 19.8 19.8 0 0 1 5 .63A30 30 0 0 1 95 32a20 20 0 0 1 15 23z"
          fill="#e5e7eb"
        />
      </svg>
      {/* Search icon circle */}
      <div className="absolute bottom-0 left-[58px] flex size-14 items-center justify-center rounded-full bg-black/20 backdrop-blur-[4px]">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
          <path
            d="M16.5 16.5L21 21"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

/** Empty/no-match state: an illustration above a headline + explanation. */
function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <section className="py-16">
      <Container>
        <div className="flex flex-col items-center gap-8 text-center">
          <SearchIllustration />
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold text-neutral-800">{title}</p>
            <p className="max-w-[520px] text-sm font-medium text-neutral-600">
              {message}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** The live "Latest Articles" strip shown under an empty/no-match state. */
function LatestArticles({ stories }: { stories: Story[] }) {
  if (stories.length === 0) return null;
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <div className="mb-8 border-l-[3px] border-pesacheck-black pl-4">
          <h2 className="text-[30px] font-extrabold leading-10 text-gray-800">
            Latest Articles
          </h2>
        </div>
        <div className="mt-1 h-px w-full bg-neutral-100" />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((story) => (
            <StoryCard key={story.href ?? story.title} story={story} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/**
 * Search results.
 *
 * Everything on this page is live Superdesk data: `listing` is a server-side
 * search (free text AND'd with the region/language/topic filters, paged by
 * `?page=`) and `latest` is the newest published fact-checks, shown under the
 * empty and no-match states. The searched-for line reports whichever criteria
 * were actually used, so a filter-only search reads
 * `2 results found for: Kenya · English` instead of an empty `""`.
 *
 * The filter dropdowns themselves live in the header search bar (see `Header`).
 */
export function SearchExplorer({
  query,
  filters,
  filterOptions,
  listing,
  latest,
  unavailable = false,
}: {
  query: string;
  filters: FilterSelection;
  filterOptions: FilterOptions;
  listing: FactCheckListing;
  latest: Story[];
  /** The search itself failed (Hasura unreachable) — not "no matches". */
  unavailable?: boolean;
}) {
  const trimmedQuery = query.trim();
  const filterLabels = selectedFilterLabels(filterOptions, filters).map(
    (f) => f.label,
  );
  const criteria = [
    ...(trimmedQuery ? [`“${trimmedQuery}”`] : []),
    ...filterLabels,
  ].join(" · ");
  const searched = Boolean(trimmedQuery) || hasActiveFilters(filters);

  // No query and no filters: nothing has been searched for yet.
  if (!searched) {
    return (
      <>
        <EmptyState
          title="Search PesaCheck"
          message="Search for a claim, place or topic — or use the filters in the search bar to browse by region, language and topic."
        />
        <LatestArticles stories={latest} />
      </>
    );
  }

  if (unavailable) {
    return (
      <>
        <EmptyState
          title="Search is unavailable right now"
          message={`We couldn't search for ${criteria} — the article service didn't respond. Please try again in a moment.`}
        />
        <LatestArticles stories={latest} />
      </>
    );
  }

  if (listing.stories.length === 0) {
    return (
      <>
        <EmptyState
          title="No matches found"
          message={`Your search for ${criteria} did not match any article. Try a different term or remove some filters.`}
        />
        <LatestArticles stories={latest} />
      </>
    );
  }

  return (
    <>
      {/* Results summary */}
      <section className="pt-10 pb-4 text-center">
        <p className="text-sm font-medium text-neutral-700">
          {listing.total} {listing.total === 1 ? "result" : "results"} found
          for:
        </p>
        <p className="mt-1 text-lg font-extrabold text-neutral-900">
          {criteria}
        </p>
      </section>

      {/* Results grid */}
      <section className="pb-14 pt-6 lg:pb-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {listing.stories.map((story) => (
              <StoryCard key={story.href ?? story.title} story={story} />
            ))}
          </div>

          {listing.totalPages > 1 && (
            <div className="mt-12">
              <PaginationNav
                page={listing.page}
                totalPages={listing.totalPages}
                filters={filters}
                query={trimmedQuery}
              />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
