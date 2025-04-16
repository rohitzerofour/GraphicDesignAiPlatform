import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disables Webpack cache temporarily to troubleshoot memory allocation issues
  webpack: (config) => {
    config.cache = false; // Disable cache to potentially reduce memory use
    return config;
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
        hostname: "replicate.delivery",
      },
    ],
  },
};

export default nextConfig;
