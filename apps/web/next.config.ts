import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    // Turborepo の monorepo 構成でトランスパイル対象を設定
  },
  transpilePackages: ['shared'],
};

export default nextConfig;
