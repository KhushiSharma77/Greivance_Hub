import "@team-call-of-code/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  // @ts-ignore - Next 16 specific configuration
  turbopack: {
    root: "../../",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rioyfhveupjkichbsvsm.supabase.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
