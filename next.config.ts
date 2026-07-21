import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.vanannek.blog",
      },
      {
        protocol: "https",
        hostname: "api.minio.vanannek.blog",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;

