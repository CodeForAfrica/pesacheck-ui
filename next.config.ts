import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Publisher media host
    // Built URLs look like ${NEXT_PUBLIC_MEDIA_URL}${asset_id}.webp` - see lib/data/map.ts.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pesacheck-staging-publisher.superdesk.pro",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
