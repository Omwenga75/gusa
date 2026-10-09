import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  partialPrefetching: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
