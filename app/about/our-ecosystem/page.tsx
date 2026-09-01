import type { Metadata } from "next";
import { EcosystemGroups } from "@/components/about/EcosystemGroups";
import { EcosystemHero } from "@/components/about/EcosystemHero";
import { EcosystemRoles } from "@/components/about/EcosystemRoles";
import { getEcosystemGroups, getEcosystemRoles } from "@/lib/data/ecosystem";
import { ECOSYSTEM_GROUPS, ECOSYSTEM_ROLES } from "@/lib/ecosystem-content";

export const metadata: Metadata = {
  title: "Our Ecosystem — PesaCheck",
  description:
    "Learn more about PesaCheck's affiliations and network partnerships. PesaCheck is Africa's largest indigenous fact-checking organisation.",
};

export const revalidate = 300;

export default async function OurEcosystemPage() {
  // Each section falls back on its own, so one uncurated list never blanks
  // the other.
  const [groups, roles] = await Promise.all([
    getEcosystemGroups().catch(() => null),
    getEcosystemRoles().catch(() => null),
  ]);

  return (
    <>
      <EcosystemHero />
      <EcosystemGroups groups={groups?.length ? groups : ECOSYSTEM_GROUPS} />
      <EcosystemRoles roles={roles?.length ? roles : ECOSYSTEM_ROLES} />
    </>
  );
}
