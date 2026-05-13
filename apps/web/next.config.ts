import "@team-call-of-code/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
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
