import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configure for GitHub Pages if using a subdirectory
  // basePath: '/slouchdetector',
  // assetPrefix: '/slouchdetector',
};

export default nextConfig;
