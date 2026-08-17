import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Media library accepts 10 images x 5 MB; keep a small allowance for
    // multipart metadata while still enforcing each file in the server action.
    serverActions: {
      bodySizeLimit: "55mb",
    },
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
