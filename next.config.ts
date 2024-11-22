import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disables Webpack cache temporarily to troubleshoot memory allocation issues
  webpack: (config) => {
    config.cache = false; // Disable cache to potentially reduce memory use
    return config;
  },

  // Other Next.js configuration options can be added here
};

export default nextConfig;
