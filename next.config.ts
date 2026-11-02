import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
