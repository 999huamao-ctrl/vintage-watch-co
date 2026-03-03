import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/shop',
        destination: '/shop/',
      },
    ];
  },
};

export default nextConfig;
