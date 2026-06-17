import type { Metadata } from "next";
import { FaqHero } from "@/components/about/FaqHero";
import { FaqGroups } from "@/components/about/FaqGroups";
import { FaqCta } from "@/components/about/FaqCta";

export const metadata: Metadata = {
  title: "FAQs — PesaCheck",
  description:
    "Answers to frequently asked questions about PesaCheck — our articles, policies and how to use the site.",
};

export default function FaqsPage() {
  return (
    <>
      <FaqHero />
      <FaqGroups />
      <FaqCta />
    </>
  );
}
