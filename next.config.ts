import type { NextConfig } from "next";

const path = require("path");

const nextConfig: NextConfig = {
  output: 'export',
  basePath: "",
  assetPrefix: "./",
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.join(__dirname, '..'),
  },
};

export default nextConfig;
