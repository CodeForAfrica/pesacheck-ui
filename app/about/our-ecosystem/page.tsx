import type { Metadata } from "next";
import { EcosystemGroups } from "@/components/about/EcosystemGroups";
import { EcosystemHero } from "@/components/about/EcosystemHero";
import { EcosystemRoles } from "@/components/about/EcosystemRoles";

export const metadata: Metadata = {
  title: "Our Ecosystem — PesaCheck",
  description:
    "Learn more about PesaCheck's affiliations and network partnerships. PesaCheck is Africa's largest indigenous fact-checking organisation.",
};

export default function OurEcosystemPage() {
  return (
    <>
      <EcosystemHero />
      <EcosystemGroups />
      <EcosystemRoles />
    </>
  );
}
