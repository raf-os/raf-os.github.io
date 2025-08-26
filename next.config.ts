import type { NextConfig } from "next";

const path = require("path");

const nextConfig: NextConfig = {
  output: 'export',
  basePath: "",
  assetPrefix: "",
  turbopack: {
    root: path.join(__dirname, '..'),
  }
};

export default nextConfig;
