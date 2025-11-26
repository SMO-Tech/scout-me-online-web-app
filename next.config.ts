import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  assetPrefix: "/",
  trailingSlash: true,

  images: {
    unoptimized: true,
    domains: ["lh3.googleusercontent.com"],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
