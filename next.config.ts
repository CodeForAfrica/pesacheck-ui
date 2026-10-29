import type { NextConfig } from "next";
import { RETIRED_DESKS } from "./lib/content-desks";

const nextConfig: NextConfig = {
  // Desks that were retired when the catalog was cut to five, and the
  // design-era slugs that predate slugs coming from topic codes. Without
  // these, a link to `/fact-checks/covid` — in a reader's history, in an old
  // tweet — 404s. See `RETIRED_DESKS`.
  async redirects() {
    return Object.entries(RETIRED_DESKS).map(([slug, destination]) => ({
      source: `/fact-checks/${slug}`,
      destination,
      permanent: false,
    }));
  },
  images: {
    // Next.js 16 blocks optimizing images whose host resolves to a private/
    // loopback IP (SSRF guard). A local Superdesk on localhost:8081 resolves to
    // ::1/127.0.0.1, so opt in. Dev/local-network only — do not enable in prod.
    dangerouslyAllowLocalIP: true,
    // Publisher media host
    // Built URLs look like ${NEXT_PUBLIC_MEDIA_URL}${asset_id}.webp` - see lib/data/map.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media-staging.pesacheck.org",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8081",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
