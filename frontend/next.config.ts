import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // 去掉 output: 'export'，启用 SSR
};

export default nextConfig;
