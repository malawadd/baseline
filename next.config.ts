import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove the webpack externals hack – it prevents bundling the JSON files.
  // Also, you usually don't need serverComponentsExternalPackages for this case.
  outputFileTracingIncludes: {
    // Match the App Router API route
    "/api/scan": [
      "./node_modules/css-tree/lib/data/**",
      "./node_modules/css-tree/package.json",
    ],
  },
};

export default nextConfig;
