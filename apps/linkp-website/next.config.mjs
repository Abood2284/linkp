import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

// Setup dev platform for local development
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Critical for Cloudflare Pages deployment
  output: "standalone",

  // Optimize for edge runtime
  experimental: {
    // Optimize React server components for edge
    serverComponentsExternalPackages: [],
  },

  transpilePackages: ["@workspace/ui"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
    // For Cloudflare Pages compatibility
    unoptimized: true,
  },

  // Add any unsupported Node.js APIs here
  // This helps Next.js know what can't be used in edge runtime
  serverRuntimeConfig: {
    // These APIs are not available in edge runtime
    unsupportedNodeApis: ["fs", "path", "crypto"],
  },
};

export default nextConfig;
