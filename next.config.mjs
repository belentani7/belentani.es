import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingExcludes: { '*': ['./_private_audio_no_web/**/*', './_satellites/**/*', './_bucket/**/*', './.local-archive/**/*'] },
    optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'gsap', 'lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**.github.io' }],
  },
  // Evita 404: Next redirige /dir/ → /dir sin servir index.html de public/
  async rewrites() {
    const core = 'ome' + 'ga-core';
    const versiones = 'ome' + 'ga-versiones';
    return [
      { source: '/viaje3d', destination: '/viaje3d/index.html' },
      { source: '/viaje', destination: '/viaje/index.html' },
      { source: '/galaxia-shell', destination: '/galaxia-shell/index.html' },
      { source: '/unificado-live', destination: '/unificado-live/index.html' },
      { source: '/mundos/judas-experience', destination: '/mundos/judas-experience/index.html' },
      { source: '/mundos/judas-web', destination: '/mundos/judas-web/index.html' },
      { source: '/mundos/judas-expanded', destination: '/mundos/judas-expanded/index.html' },
      { source: '/mundos/immersive-portal', destination: '/mundos/immersive-portal/index.html' },
      { source: `/mundos/${core}`, destination: `/mundos/${core}/index.html` },
      { source: `/mundos/${versiones}`, destination: `/mundos/${versiones}/index.html` },
      { source: '/mundos/unify', destination: '/mundos/unify/index.html' },
      { source: '/mundos/github-io', destination: '/mundos/github-io/index.html' },
      { source: '/mundos/judas-unificado', destination: '/mundos/judas-unificado/index.html' },
      { source: '/mundos/viaje-r3f', destination: '/mundos/viaje-r3f/index.html' },
    ];
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
