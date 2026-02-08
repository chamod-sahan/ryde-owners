import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://57.129.119.217:9090/api/:path*',
      },
    ]
  },
};

export default nextConfig;
