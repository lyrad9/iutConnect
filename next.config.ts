import type { NextConfig } from "next";
const nextConfig: NextConfig = {
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
