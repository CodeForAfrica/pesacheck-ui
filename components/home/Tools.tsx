import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { ABOUT_BLURB } from "@/lib/site";
import { TOOLS, type Tool } from "@/lib/tools-content";

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col"
    >
      {/*
       * The mockups sit at 120% and pinned to the top, which crops the phones.
       * Hovering eases back to 100% so the whole composition — and the screen
       * content in it — comes into view. The frame carries the artwork's own
       * lavender so there is no white flash before the image paints.
       */}
      <div className="relative aspect-[533/271] w-full overflow-hidden rounded-lg bg-[#d0d7f9]">
        <Image
          src={tool.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 292px"
          className="origin-top scale-120 object-cover object-top transition-transform duration-500 ease-out group-hover:scale-100"
        />
      </div>

      <h3 className="mt-5 text-2xl font-extrabold text-pesacheck-black">
        {tool.name}
      </h3>
      <span className="mt-2 h-[3px] w-7 bg-pesacheck-blue" />
      <p className="mt-3 text-md font-medium text-neutral-600">
        {tool.tagline}
      </p>
      <p className="mt-4 line-clamp-3 text-md font-medium text-neutral-800">
        {tool.body}
      </p>
      <span className="mt-3 flex items-center gap-1.5 text-md font-semibold text-pesacheck-blue">
        {tool.cta}
        <FiArrowUpRight size={14} aria-hidden />
      </span>
    </Link>
  );
}

export function Tools() {
  return (
    <section id="tools" className="py-14 lg:py-20">
      <Container>
        <SectionHeading title="More than fact-checking" />
        <p className="mt-4 max-w-[610px] text-md font-medium text-neutral-600">
          {ABOUT_BLURB}
        </p>

        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </Container>
    </section>
  );
}
