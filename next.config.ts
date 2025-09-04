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
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "festive-aardvark-68.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
