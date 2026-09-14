import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack does not look above this folder.
  turbopack: { root: path.resolve(".") },
};

export default nextConfig;
