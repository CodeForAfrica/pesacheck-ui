import { ArrowUpRight } from "@untitledui/icons/ArrowUpRight";
import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { TOOLS, type Tool } from "@/lib/home-content";
import { ABOUT_BLURB } from "@/lib/site";

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href="#"
      className="group relative flex aspect-[610/474] w-full overflow-hidden rounded-lg"
    >
      <Image
        src={tool.image}
        alt={tool.name}
        fill
        sizes="(max-width: 1024px) 100vw, 610px"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

      <div className="relative mt-auto flex flex-col gap-2 p-8 text-white">
        <h3 className="text-lg font-extrabold">{tool.name}</h3>
        <p className="text-sm font-medium">{tool.tagline}</p>
        <p className="max-w-[550px] text-sm font-medium leading-5 text-white/90">
          {tool.body}
        </p>
        <span className="my-1 h-0.5 w-10 rounded bg-white" />
        <span className="flex items-center gap-1 text-sm font-medium">
          {tool.cta}
          <ArrowUpRight size={10} className="brightness-0 invert" aria-hidden />
        </span>
      </div>
    </a>
  );
}

export function Tools() {
  return (
    <section id="tools" className="py-14 lg:py-20">
      <Container>
        <SectionHeading title="More than fact-checking" />
        <p className="mt-6 max-w-[610px] text-sm font-medium leading-5 text-neutral-900">
          {ABOUT_BLURB}
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      </Container>
    </section>
  );
}
