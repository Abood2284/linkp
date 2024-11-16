// next.config.mjs
import { withAxiom } from "next-axiom";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Use SWC for minification instead of Terser

  // Optimize output size
  output: "standalone", // Creates optimized production builds

  // Optimize images
  images: {
    unoptimized: true, // Since we're using Cloudflare Images
    domains: [
      "res.cloudinary.com",
      // Add other image domains you use
    ],
  },

  // Webpack optimization
  webpack: (config, { isServer }) => {
    // Only keep minimal locale data from moment
    config.resolve.alias["moment"] = "moment/moment.js";

    // Optimize CSS
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: "styles",
        test: /\.(css|scss)$/,
        chunks: "all",
        enforce: true,
      };
    }

    // Optimize packages
    config.resolve.alias = {
      ...config.resolve.alias,
      // Add your aliases here
      "@components": "./src/components",
      "@lib": "./src/lib",
    };

    // Remove large debug files from production
    if (process.env.NODE_ENV === "production") {
      config.optimization.minimize = true;
      config.optimization.minimizer = [
        ...config.optimization.minimizer,
        // Add custom minimizers if needed
      ];
    }

    return config;
  },

  // Experimental features
  experimental: {
    // Enable if you're using React Server Components
    serverActions: true,
    // Optimize server components
    serverComponentsExternalPackages: ["@prisma/client"],
  },

  // Environment Configuration
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    // Add other public env variables
  },

  // Headers to optimize caching and security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default withAxiom(nextConfig);
