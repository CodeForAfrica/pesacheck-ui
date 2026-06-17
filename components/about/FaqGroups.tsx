import { Container } from "@/components/ui/SectionHeading";
import { FAQ_GROUPS } from "@/lib/faqs-content";

// The body of the FAQs page: a stack of titled groups, each laying its Q&A pairs
// out in a 3-column grid on desktop (Figma columns at x=100/520/940). The grid
// collapses to two columns on tablet and one on mobile.
export function FaqGroups() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-12 sm:gap-14">
        {FAQ_GROUPS.map((group) => (
          <div key={group.title}>
            <h2 className="text-xl font-bold text-[#181d27]">{group.title}</h2>
            <dl className="mt-6 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item, i) => (
                <div key={`${group.title}-${i}`} className="flex flex-col gap-1">
                  <dt className="text-sm font-bold text-[#181d27]">{item.question}</dt>
                  <dd className="text-sm font-medium leading-5 text-[#535862]">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </Container>
    </section>
  );
}
