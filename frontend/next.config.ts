import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  output: 'standalone',
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
    resolveAlias: {
      '@': './src',
    },
  },
};

export default nextConfig;
