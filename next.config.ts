import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  serverExternalPackages: ["better-sqlite3"],
  output: "standalone",
};

export default nextConfig;
