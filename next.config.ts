import type { NextConfig } from "next";

// 多图功能已启用 - 2026-03-25
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
