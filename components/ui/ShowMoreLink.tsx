import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

/**
 * "Show more ↗" affordance for a `SectionHeading`'s action slot — used by the
 * home-page sections that show a trimmed grid and hand the rest off to a
 * listing page.
 */
export function ShowMoreLink({
  href,
  label = "Show more",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-2 text-sm font-semibold text-pesacheck-blue hover:underline"
    >
      {label}
      <FiArrowUpRight size={12} aria-hidden />
    </Link>
  );
}
