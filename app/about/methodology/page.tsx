import type { Metadata } from "next";
import { MethodologyHero } from "@/components/about/MethodologyHero";
import { MethodologyBody } from "@/components/about/MethodologyBody";

export const metadata: Metadata = {
  title: "Methodology — PesaCheck",
  description:
    "How PesaCheck, Africa's largest indigenous fact-checking organisation, researches, verifies and publishes its fact-checks.",
};

export default function MethodologyPage() {
  return (
    <>
      <MethodologyHero />
      <MethodologyBody />
    </>
  );
}
