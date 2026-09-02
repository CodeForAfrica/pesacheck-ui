import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamMemberView } from "@/components/about/TeamMemberView";
import { getTeamMember } from "@/lib/data/team";

type Params = Promise<{ slug: string }>;

// Matches the About page the grid sits on.
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = await getTeamMember(slug).catch(() => null);
  if (!member) return {};

  const { article, role } = member;
  return {
    title: `${article.title} — PesaCheck`,
    // The role reads better than a truncated biography in a search result.
    description: role ? `${article.title}, ${role} at PesaCheck.` : undefined,
  };
}

/**
 * A staff member's page. Live-only, like the Media Centre entry route: the
 * static fallback holds sample fact-checks, and there is no placeholder person
 * worth serving here.
 */
export default async function TeamMemberPage({ params }: { params: Params }) {
  const { slug } = await params;
  const member = await getTeamMember(slug).catch(() => null);
  if (!member) notFound();

  return (
    <TeamMemberView
      member={member.article}
      role={member.role}
      linkedin={member.linkedin}
    />
  );
}
