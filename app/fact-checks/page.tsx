import type { Metadata } from "next";
import { FactChecksContentDesks } from "@/components/fact-checks/FactChecksContentDesks";
import { FactChecksExplorer } from "@/components/fact-checks/FactChecksExplorer";
import { getFactChecks } from "@/lib/data/stories";
import { FEATURE, FEATURE_SECONDARY, STORIES } from "@/lib/fact-checks-content";

export const metadata: Metadata = {
  title: "Fact-Checks — PesaCheck",
  description:
    "Browse PesaCheck's fact-checks across Africa. Filter by region, language and topic to find the verifications that matter to you.",
};

export default async function FactChecksPage() {
  // Page owns fetching; fall back to the static design pool when Hasura is
  // unreachable or unconfigured.
  const stories = (await getFactChecks().catch(() => null)) ?? [
    FEATURE,
    FEATURE_SECONDARY,
    ...STORIES,
  ];

  return (
    <>
      <FactChecksExplorer stories={stories} />
      <FactChecksContentDesks />
    </>
  );
}
