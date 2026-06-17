import type { Metadata } from "next";
import { FundingHero } from "@/components/about/FundingHero";
import { FundingBody } from "@/components/about/FundingBody";

export const metadata: Metadata = {
  title: "Funding — PesaCheck",
  description:
    "How PesaCheck, Africa's largest indigenous fact-checking organisation, is funded and the principles that govern its support.",
};

export default function FundingPage() {
  return (
    <>
      <FundingHero />
      <FundingBody />
    </>
  );
}
