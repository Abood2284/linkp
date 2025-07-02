import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Preserve transpile packages configuration
  transpilePackages: ["@workspace/ui"],

  // Keep image configuration from previous setup
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
    // For Cloudflare compatibility
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optional: Add experimental settings if needed
  experimental: {
    // Any experimental features you were using
  },
};

export default nextConfig;

// Initialize OpenNext for development
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
