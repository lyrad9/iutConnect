import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "*",
    "dashboard.convex.dev",
  ],
 */
  experimental: {
    authInterrupts: true,
  },
  /* output: "export", */
  /*  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true }, */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
