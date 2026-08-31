import Image from "next/image";
import Link from "next/link";
import { FaLinkedinIn } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { Container } from "@/components/ui/SectionHeading";
import type { Article } from "@/lib/article-content";

// Mirrors the body styling in ArticleBodyShort — a biography reads like an
// article body, just without the tag row and footnotes.
const PROSE_CLASS = [
  "flex flex-col gap-5 text-sm font-medium leading-5 text-neutral-900",
  "[&_a]:font-semibold [&_a]:text-pesacheck-blue [&_a]:underline",
  "[&_img]:my-2 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-lg",
  "[&_b]:font-semibold [&_strong]:font-semibold",
].join(" ");

/**
 * A staff member's page. Deliberately plainer than `ArticleView`: there is no
 * verdict, no read time and no related stories on a person, and the body is a
 * biography rather than a fact-check.
 */
export function TeamMemberView({
  member,
  role,
  linkedin,
}: {
  member: Article;
  role?: string;
  linkedin?: string;
}) {
  return (
    <article className="py-14 lg:py-20">
      <Container>
        <Link
          href="/about#our-team"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition-colors hover:text-pesacheck-blue"
        >
          <FiArrowLeft size={16} aria-hidden />
          Our team
        </Link>

        <header className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
          {member.image && (
            <Image
              src={member.image}
              alt=""
              width={120}
              height={120}
              className="size-[120px] shrink-0 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-extrabold leading-tight text-pesacheck-black lg:text-4xl">
              {member.title}
            </h1>
            {role && (
              <p className="mt-2 text-md font-medium text-neutral-500">
                {role}
              </p>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-pesacheck-blue transition-colors hover:text-pesacheck-black"
              >
                <FaLinkedinIn size={14} aria-hidden />
                LinkedIn
              </a>
            )}
          </div>
        </header>

        {member.bodyHtml && (
          <div className="mt-10 max-w-[720px]">
            {/* Sanitized server-side in lib/data/body.ts:renderBody. */}
            <div
              className={PROSE_CLASS}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized in renderBody
              dangerouslySetInnerHTML={{ __html: member.bodyHtml }}
            />
          </div>
        )}
      </Container>
    </article>
  );
}
