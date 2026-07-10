import type { Metadata } from "next";
import { AboutPageBody } from "@/components/about/AboutPageBody";
import { FundingHero } from "@/components/about/FundingHero";
import { FUNDING_SECTIONS } from "@/lib/funding-content";

export const metadata: Metadata = {
  title: "Funding — PesaCheck",
  description:
    "How PesaCheck, Africa's largest indigenous fact-checking organisation, is funded and the principles that govern its support.",
};

export default function FundingPage() {
  return (
    <>
      <FundingHero />
      <AboutPageBody navLabel="Funding" sections={FUNDING_SECTIONS} />
    </>
  );
}
