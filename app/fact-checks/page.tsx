import type { Metadata } from "next";
import { FactChecksExplorer } from "@/components/fact-checks/FactChecksExplorer";
import { FactChecksContentDesks } from "@/components/fact-checks/FactChecksContentDesks";

export const metadata: Metadata = {
  title: "Fact-Checks — PesaCheck",
  description:
    "Browse PesaCheck's fact-checks across Africa. Filter by region, language and topic to find the verifications that matter to you.",
};

export default function FactChecksPage() {
  return (
    <>
      <FactChecksExplorer />
      <FactChecksContentDesks />
    </>
  );
}
