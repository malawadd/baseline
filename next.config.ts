import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for css-tree module not found error in serverless
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'css-tree': 'commonjs css-tree'
      });
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['css-tree']
  }
};

export default nextConfig;
