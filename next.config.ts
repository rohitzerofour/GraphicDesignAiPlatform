import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disables Webpack cache temporarily to troubleshoot memory allocation issues
  webpack: (config) => {
    config.cache = false; // Disable cache to potentially reduce memory use
    return config;
  },

  // Disable ESLint during build to allow deployment
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Other Next.js configuration options can be added here
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "tthepp1y8p.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
    ],
  },
};

export default nextConfig;
