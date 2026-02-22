import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/roc-helper" : "",
  reactCompiler: true,
  compiler: {
    removeConsole: isProd,
  },
  images: {
    unoptimized: true,
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
