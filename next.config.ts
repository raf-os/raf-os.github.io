import type { NextConfig } from "next";

const path = require("path");

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: "",
  assetPrefix: isDev ? undefined : "./",
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.join(__dirname, '..'),
  },
};

export default nextConfig;
