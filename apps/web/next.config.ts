import type { NextConfig } from "next";
import nextT from "next-transpile-modules";

const nextConfig: NextConfig = nextT(["antd-mobile"])({
  //   experimental: {
  //     turbo: {
  //       // ...
  //     },
  //   },
});

export default nextConfig;
