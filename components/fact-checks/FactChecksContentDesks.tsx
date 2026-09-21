import { ContentDesksRow } from "@/components/ui/ContentDesksRow";
import { Container } from "@/components/ui/SectionHeading";
import type { ContentDesk } from "@/lib/content-desks";

/**
 * The "Content Desks" row at the foot of a desk page. `desks` is the live
 * catalog the page already fetched; omitting it falls back to the static one.
 */
export function FactChecksContentDesks({
  activeSlug,
  desks,
}: {
  activeSlug?: string;
  desks?: ContentDesk[];
}) {
  return (
    <section className="pb-16 lg:pb-20">
      <Container>
        <div className="flex items-center gap-4">
          <span className="h-[30px] w-[5px] shrink-0 bg-pesacheck-black" />
          <h2 className="text-2xl font-extrabold leading-10 text-pesacheck-black md:text-[30px]">
            Content Desks
          </h2>
        </div>

        <ContentDesksRow activeSlug={activeSlug} desks={desks} />
      </Container>
    </section>
  );
}
