import type { NextConfig } from "next";

// "IT WORKS STOP CRYING!" - Me
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};


export default nextConfig;
