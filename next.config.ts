import type { NextConfig } from "next";

// Check if we are running in the 'production' environment
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Note: Removed 'output: export' to support dynamic routes like /library/[id]
  // For static hosting (S3), use query params or deploy to Vercel/Amplify instead

  // Keep trailing slash for cleaner URLs
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