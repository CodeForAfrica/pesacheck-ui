import { ContentDesksRow } from "@/components/ui/ContentDesksRow";
import { Container } from "@/components/ui/SectionHeading";
import type { ContentDesk } from "@/lib/content-desks";

export function ContentDesks({ desks }: { desks?: ContentDesk[] }) {
  return (
    <section id="knowledge" className="py-14 lg:py-20">
      <Container>
        <h2 className="text-2xl font-extrabold leading-10 text-gray-800 md:text-[30px]">
          Content Desks
        </h2>
        <ContentDesksRow desks={desks} />
      </Container>
    </section>
  );
}
