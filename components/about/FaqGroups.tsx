import { Container } from "@/components/ui/SectionHeading";
import { FAQ_GROUPS, type FaqGroup } from "@/lib/faqs-content";

// The body of the FAQs page: a stack of titled groups, each laying its Q&A pairs
// out in a 3-column grid on desktop (Figma columns at x=100/520/940). The grid
// collapses to two columns on tablet and one on mobile.
export function FaqGroups({ groups = FAQ_GROUPS }: { groups?: FaqGroup[] }) {
  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-12 sm:gap-14">
        {groups.map((group) => (
          <div key={group.title}>
            {/* Questions carrying no group tag collect in one untitled group,
                which reads as a plain list rather than an empty heading. */}
            {group.title && (
              <h2 className="text-xl font-bold text-[#181d27]">
                {group.title}
              </h2>
            )}
            <dl
              className={`grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 ${
                group.title ? "mt-6" : ""
              }`}
            >
              {group.items.map((item) => (
                <div key={item.question} className="flex flex-col gap-1">
                  <dt className="text-sm font-bold text-[#181d27]">
                    {item.question}
                  </dt>
                  <dd className="text-sm font-medium leading-5 text-[#535862]">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </Container>
    </section>
  );
}
