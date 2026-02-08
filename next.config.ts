import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "riseofcultures.wiki.gg",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
