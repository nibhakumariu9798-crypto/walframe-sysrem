import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "10.173.136.198",
    "10.173.136.198:3000",
    "10.*.*.*",
    "192.168.*.*",
    "172.*.*.*",
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
  ],
};

export default nextConfig;
