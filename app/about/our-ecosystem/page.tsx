import type { Metadata } from "next";
import { EcosystemHero } from "@/components/about/EcosystemHero";
import { ComingSoon } from "@/components/tools/ComingSoon";

export const metadata: Metadata = {
  title: "Our Ecosystem — PesaCheck",
  description:
    "Learn more about PesaCheck's affiliations and network partnerships. PesaCheck is Africa's largest indigenous fact-checking organisation.",
};

export default function OurEcosystemPage() {
  return (
    <>
      <EcosystemHero />
      <ComingSoon label="Content Coming Soon" />
    </>
  );
}
