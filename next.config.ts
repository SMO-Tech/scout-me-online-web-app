import type { NextConfig } from "next";

// Check if we are running in the 'production' environment
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Enable static export
  output: 'export',

  // Configure for S3 hosting
  assetPrefix: '/',
  
  // Disable server-side features not compatible with static export
  trailingSlash: true,

  // General settings
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com'], // Allow Google profile images
  },
  
  // Disable ESLint and TypeScript checks during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;