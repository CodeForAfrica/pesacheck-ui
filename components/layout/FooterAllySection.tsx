"use client";

import { usePathname } from "next/navigation";
import { AllyPartnerStrip } from "@/components/ui/AllyPartnerStrip";
import type { Logo } from "@/lib/site";

/**
 * The ally and partner strip as the footer renders it — on every page except
 * the ones that place it themselves as a section, where it would appear twice.
 *
 * The markup lives in `AllyPartnerStrip`; this is only the decision about
 * where the footer shows it, which needs the current path and so needs a
 * client component.
 */
const PLACES_ITS_OWN_STRIP = ["/about/partners", "/about"];

export function FooterAllySection({
  allies,
  partners,
}: {
  allies?: Logo[];
  partners?: Logo[];
}) {
  const pathname = usePathname();
  if (PLACES_ITS_OWN_STRIP.includes(pathname)) return null;

  return <AllyPartnerStrip allies={allies} partners={partners} />;
}
