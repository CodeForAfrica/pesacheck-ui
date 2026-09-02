import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BackToTop } from "@/components/layout/BackToTop";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getFilterOptions } from "@/lib/data/filter-options";
import { getNavigation } from "@/lib/data/navigation";
import { FALLBACK_FILTER_OPTIONS } from "@/lib/fact-checks-content";
import { NAV_LINKS } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PesaCheck — Decoding the numbers that shape our world",
  description:
    "PesaCheck is Africa's largest indigenous fact-checking organisation, debunking misleading claims and providing accurate information for sound decision-making.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        rel: "android-chrome",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "android-chrome",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The header's Region/Language/Topic dropdowns are live: their contents come
  // from the taxonomy published fact-checks carry (cached — see
  // `lib/data/filter-options.ts`). The curated set is degraded-mode only.
  // The nav is curated in Publisher as the `Main Navigation` menu. An
  // unreachable Hasura and a menu nobody has built arrive the same way — as
  // nothing to show — and a site with no header links is unusable, so both
  // keep the static nav.
  const [filterOptions, navLinks] = await Promise.all([
    getFilterOptions().catch(() => null),
    getNavigation().catch(() => null),
  ]);

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-pesacheck-black">
        <Header
          filterOptions={filterOptions ?? FALLBACK_FILTER_OPTIONS}
          navLinks={navLinks?.length ? navLinks : NAV_LINKS}
        />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
