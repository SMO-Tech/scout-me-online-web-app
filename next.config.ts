import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensures SSR & dynamic routing work normally
  output: undefined, // or just remove this line entirely

  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com'],
  },

  trailingSlash: true,

  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;