import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensures SSR & dynamic routing work normally
  output: undefined, // or just remove this line entirely

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  trailingSlash: true,
  
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;