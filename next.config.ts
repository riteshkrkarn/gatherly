import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // <--- This will fix the 400 error and save server resources
  },
};

export default nextConfig;
