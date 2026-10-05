import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  experimental: {
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'gsap', 'lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**.github.io' }],
    unoptimized: true,
  },
  headers: async () => [
    { source: '/:path*', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }] },
    { source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };
    }
    config.externals.push({ 'sharp': 'commonjs sharp' });
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);