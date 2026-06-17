import { Container } from "@/components/ui/SectionHeading";
import { ContentDesksRow } from "@/components/ui/ContentDesksRow";

export function ContentDesks() {
  return (
    <section id="knowledge" className="py-14 lg:py-20">
      <Container>
        <h2 className="text-2xl font-extrabold leading-10 text-gray-800 md:text-[30px]">
          Content Desks
        </h2>
        <ContentDesksRow />
      </Container>
    </section>
  );
}
