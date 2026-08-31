import Image from "next/image";
import Link from "next/link";
import { FaLinkedinIn } from "react-icons/fa";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { ABOUT_TEAM, type TeamMember } from "@/lib/about-content";

/** The design's grey circle, shown for a member with no portrait attached. */
function Avatar({ member }: { member: TeamMember }) {
  if (!member.image) {
    return (
      <span className="size-[60px] rounded-full bg-neutral-100" aria-hidden />
    );
  }
  return (
    <Image
      src={member.image}
      alt=""
      width={60}
      height={60}
      className="size-[60px] rounded-full object-cover"
    />
  );
}

/** The badge only becomes a link when there is a profile to open. */
function LinkedInBadge({ href }: { href?: string }) {
  const badge = (
    <span className="flex size-5 items-center justify-center rounded-full bg-neutral-600">
      <FaLinkedinIn size={11} color="white" aria-hidden />
    </span>
  );

  if (!href) return badge;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-opacity hover:opacity-80"
    >
      {badge}
      <span className="sr-only">LinkedIn profile</span>
    </a>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col">
      <Avatar member={member} />
      <div className="mt-3 flex items-center gap-2">
        <p className="text-sm font-bold leading-5 text-neutral-900">
          {member.name}
        </p>
        <LinkedInBadge href={member.linkedin} />
      </div>
      <p className="mt-1 text-sm font-medium leading-5 text-neutral-500">
        {member.role}
      </p>
      <p className="mt-3 text-sm font-medium leading-5 text-neutral-900">
        {member.bio}{" "}
        {/* Static members have no page to open, so the design's affordance
            stays plain text rather than linking nowhere. */}
        {member.href ? (
          <Link
            href={member.href}
            className="text-neutral-500 underline-offset-2 hover:text-pesacheck-blue hover:underline"
          >
            See more
          </Link>
        ) : (
          <span className="text-neutral-500">See more</span>
        )}
      </p>
    </div>
  );
}

export function AboutTeam({ team = ABOUT_TEAM }: { team?: TeamMember[] }) {
  return (
    <section id="our-team" className="py-14 lg:py-20">
      <Container>
        <SectionHeading title="Our team" />
        <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, i) => (
            // The static fallback is ten copies of one placeholder person, so
            // the name is not unique; the page is what identifies a member.
            <TeamCard
              key={member.href ?? `${member.name}-${i}`}
              member={member}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
