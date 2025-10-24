import type { NextConfig } from "next";

// Check if we are running in the 'production' environment
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // 1. Conditionally apply output: "export"
  output: isProd ? "export" : undefined, 

  // 2. Conditionally apply assetPrefix (if needed for deployment on S3/subpath)
  // Note: Vercel often recommends leaving assetPrefix undefined unless using a custom CDN.
  // We'll only apply it in production if you need relative paths.
  assetPrefix: isProd ? './' : undefined,

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