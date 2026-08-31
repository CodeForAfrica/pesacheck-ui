import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { Container } from "@/components/ui/SectionHeading";
import {
  ECOSYSTEM_GROUPS,
  ECOSYSTEM_INTRO,
  type EcosystemGroup,
  type EcosystemTone,
} from "@/lib/ecosystem-content";

const TONE_COLORS: Record<EcosystemTone, string> = {
  blue: "#0b2aea",
  green: "#15803d",
  red: "#d80027",
  ink: "#021d32",
};

function GroupHeading({ title }: { title: string }) {
  return (
    <div className="mb-[34px]">
      <div className="flex items-center gap-[14px]">
        <span className="h-7 w-[5px] shrink-0 rounded-sm bg-pesacheck-blue" />
        <h2 className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#021d32]">
          {title}
        </h2>
      </div>
      <div className="mt-[18px] h-px bg-[#e4e5e8]" />
    </div>
  );
}

export function EcosystemGroups({
  groups = ECOSYSTEM_GROUPS,
}: {
  groups?: EcosystemGroup[];
}) {
  return (
    <>
      <section className="pt-20 pb-0">
        <Container>
          <p className="max-w-[760px] text-base font-normal leading-[1.7] text-[#3b3f45]">
            {ECOSYSTEM_INTRO}
          </p>
        </Container>
      </section>

      {groups.map((group, i) => (
        <section
          key={group.title}
          className={i % 2 ? "bg-[#f6f7f9] py-16" : "py-16"}
        >
          <Container>
            {group.title && <GroupHeading title={group.title} />}
            <div className="grid grid-cols-1 gap-x-10 gap-y-11 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <article key={item.name} className="flex flex-col">
                  <div className="mb-4 flex h-[38px] items-center">
                    <Image
                      src={item.logo.src}
                      alt={item.name}
                      width={item.logo.width}
                      height={item.logo.height}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "170px",
                        width: "auto",
                      }}
                      className="object-contain"
                    />
                  </div>
                  <div className="mb-[14px] flex items-start gap-3">
                    <span
                      className="mt-[3px] h-[18px] w-[3px] shrink-0 rounded-sm"
                      style={{ backgroundColor: TONE_COLORS[item.tone] }}
                    />
                    <h3
                      className="text-[15px] font-bold uppercase tracking-[0.06em]"
                      style={{ color: TONE_COLORS[item.tone] }}
                    >
                      {item.name}
                    </h3>
                    <span className="ml-auto shrink-0 self-start whitespace-nowrap rounded-full border border-[#e4e5e8] px-3 py-1 text-xs font-medium text-[#6b7078]">
                      {item.role}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col pl-[15px]">
                    <p className="mb-[14px] text-sm font-normal leading-[1.7] text-[#3b3f45]">
                      {item.description}
                    </p>
                    <Link
                      href={item.href}
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="mt-auto inline-flex w-fit items-center gap-[6px] text-[13px] font-semibold text-[#021d32] transition hover:text-pesacheck-blue"
                    >
                      Learn More <FiArrowUpRight size={13} aria-hidden />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
