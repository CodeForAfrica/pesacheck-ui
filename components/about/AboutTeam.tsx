import { Icon } from "@/components/ui/Icon";
import { Container, SectionHeading } from "@/components/ui/SectionHeading";
import { ABOUT_TEAM, type TeamMember } from "@/lib/about-content";

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="flex flex-col">
      <span className="size-[60px] rounded-full bg-neutral-100" aria-hidden />
      <div className="mt-3 flex items-center gap-2">
        <p className="text-sm font-bold leading-5 text-neutral-900">
          {member.name}
        </p>
        <span className="flex size-4 items-center justify-center rounded-[3px] bg-neutral-600">
          <Icon name="linkedin" size={9} alt={`${member.name} on LinkedIn`} />
        </span>
      </div>
      <p className="mt-1 text-sm font-medium leading-5 text-neutral-500">
        {member.role}
      </p>
      <p className="mt-3 text-sm font-medium leading-5 text-neutral-900">
        {member.bio}
        <span className="text-neutral-500"> See more</span>
      </p>
    </div>
  );
}

export function AboutTeam() {
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <SectionHeading title="Our team" />
        <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_TEAM.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </Container>
    </section>
  );
}
