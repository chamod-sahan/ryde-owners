import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-0cf5c7fe79a44602b4aecc92ddf64c8f.r2.dev',
        pathname: '/**',
      },
    ],
  },
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
