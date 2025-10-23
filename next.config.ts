import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // <-- enables static export for S3
  images: {
    unoptimized: true, // <-- disables Next.js Image Optimization (S3 can't run it)
  },
  trailingSlash: true, // <-- optional: makes URLs like /about/ work on S3
  assetPrefix: "./",
};

export default nextConfig;
