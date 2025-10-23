import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'], // Allow Google profile images
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
