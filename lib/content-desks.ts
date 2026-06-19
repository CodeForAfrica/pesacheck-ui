/**
 * Canonical list of PesaCheck content desks. Each desk has its own landing page
 * at `/fact-checks/<slug>` (see `app/fact-checks/[desk]/page.tsx`). This is the
 * single source of truth shared by every place the "Content Desks" row is shown
 * — the home page (`components/home/ContentDesks`) and the fact-checks pages
 * (`components/fact-checks/FactChecksContentDesks`).
 */

export type ContentDesk = { name: string; slug: string; image: string };

export const CONTENT_DESKS: ContentDesk[] = [
  {
    name: "Climate Change",
    slug: "climate-change",
    image: "/images/content-desks/content2.png",
  },
  { name: "Gender", slug: "gender", image: "/images/content-desks/gender.png" },
  {
    name: "Elections",
    slug: "elections",
    image: "/images/content-desks/elections.png",
  },
  {
    name: "Public Finances",
    slug: "public-finances",
    image: "/images/content-desks/public-finance.png",
  },
  { name: "Scams", slug: "scams", image: "/images/content-desks/scams.png" },
  {
    name: "Health",
    slug: "health",
    image: "/images/content-desks/content3.png",
  },
  {
    name: "Migration",
    slug: "migration",
    image: "/images/content-desks/content4.png",
  },
];

export function deskBySlug(slug: string): ContentDesk | undefined {
  return CONTENT_DESKS.find((desk) => desk.slug === slug);
}
