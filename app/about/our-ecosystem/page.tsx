import type { Metadata } from "next";
import { EcosystemGroups } from "@/components/about/EcosystemGroups";
import { EcosystemHero } from "@/components/about/EcosystemHero";
import { EcosystemRoles } from "@/components/about/EcosystemRoles";
import { getEcosystemGroups } from "@/lib/data/ecosystem";
import { ECOSYSTEM_GROUPS } from "@/lib/ecosystem-content";

export const metadata: Metadata = {
  title: "Our Ecosystem — PesaCheck",
  description:
    "Learn more about PesaCheck's affiliations and network partnerships. PesaCheck is Africa's largest indigenous fact-checking organisation.",
};

export const revalidate = 300;

export default async function OurEcosystemPage() {
  const groups = await getEcosystemGroups().catch(() => null);

  return (
    <>
      <EcosystemHero />
      <EcosystemGroups groups={groups?.length ? groups : ECOSYSTEM_GROUPS} />
      <EcosystemRoles />
    </>
  );
}
