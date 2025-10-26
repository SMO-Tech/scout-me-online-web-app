import type { NextConfig } from "next";

// Check if we are running in the 'production' environment
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // 1. Conditionally apply output: "export"
  output: isProd ? "export" : undefined, 

  // 2. Update assetPrefix configuration
  assetPrefix: isProd ? '/' : undefined,

  // General settings (always apply)
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com'], // Allow Google profile images
  },
  trailingSlash: true,
  
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