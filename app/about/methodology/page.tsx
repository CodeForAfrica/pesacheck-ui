import type { Metadata } from "next";
import { AboutPageBody } from "@/components/about/AboutPageBody";
import { MethodologyHero } from "@/components/about/MethodologyHero";
import { METHODOLOGY_SECTIONS } from "@/lib/methodology-content";

export const metadata: Metadata = {
  title: "Methodology — PesaCheck",
  description:
    "How PesaCheck, Africa's largest indigenous fact-checking organisation, researches, verifies and publishes its fact-checks.",
};

export default function MethodologyPage() {
  return (
    <>
      <MethodologyHero />
      <AboutPageBody navLabel="Methodology" sections={METHODOLOGY_SECTIONS} />
    </>
  );
}
