import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { ABOUT_BLURB } from "@/lib/site";
import { TOOLS, type Tool } from "@/lib/tools-content";

/*
 * Full-width take on the homepage "More than fact-checking" row: two cards per
 * row instead of four, each a navy panel with the product mockup bleeding off
 * the top. The image well is 606×348 in the design (hence the aspect ratio),
 * and the lavender plate dissolves into the panel rather than butting against
 * it, so its last 66px carry a wash down to the card colour.
 */
const IMAGE_FADE =
  "linear-gradient(to bottom, rgba(2, 29, 51, 0) 0%, #021d33 100%)";

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-lg bg-pesacheck-black"
    >
      <div className="relative aspect-[101/58] w-full shrink-0 overflow-hidden bg-[#d0d7f9]">
        <Image
          src={tool.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1240px) 50vw, 606px"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span
          className="absolute inset-x-0 bottom-0 h-[66px]"
          style={{ backgroundImage: IMAGE_FADE }}
        />
      </div>

      <div className="max-w-[460px] px-8 pb-8 pt-5">
        <h3 className="text-xl font-bold text-white">{tool.name}</h3>
        <span className="mt-4 block h-[3px] w-7 bg-white" />
        <p className="mt-2 text-sm leading-6 text-white">{tool.tagline}</p>
        <p className="mt-4 text-sm leading-6 text-white/80">{tool.body}</p>
        <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-white">
          {tool.cta}
          <FiArrowUpRight size={14} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function ToolsShowcase({
  tools = TOOLS,
  bare = false,
}: {
  tools?: Tool[];
  /** Drops the section and container, for a page that already provides them. */
  bare?: boolean;
}) {
  const grid = (
    <>
      <SectionHeading title="More than fact-checking" />
      <p className="mt-4 max-w-[610px] text-sm font-medium leading-relaxed text-neutral-600">
        {ABOUT_BLURB}
      </p>

      <div className="mt-9 grid gap-7 sm:grid-cols-2">
        {tools.map((tool) => (
          <ToolCard key={tool.name} tool={tool} />
        ))}
      </div>
    </>
  );

  if (bare) return grid;

  return (
    <section className="py-14 lg:py-20">
      <Container>{grid}</Container>
    </section>
  );
}
