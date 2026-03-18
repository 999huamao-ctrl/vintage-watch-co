import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  distDir: ".next",
  trailingSlash: true,
};

export default nextConfig;
