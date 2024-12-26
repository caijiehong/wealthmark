import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
  },
  transpilePackages: ["antd-mobile"],
};

export default nextConfig;
