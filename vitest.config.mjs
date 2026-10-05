import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'app/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/', '_clones/', '_ARCHIVO/', 'Ciclona/', 'masters/', 'viaje-r3f/', 'espacio-3d/', 'unificado/', 'banco-recursos-galacticos/', 'Belentani/', 'lore-canon/', 'app-web-nextjs/', '.pnpm/'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '**/*.d.ts', '**/*.test.*'],
    },
    transformMode: {
      web: [/\.[jt]sx$/],
    },
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './app'),
      '@/design-system': path.resolve(__dirname, './src/design-system'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/styles': path.resolve(__dirname, './src/styles'),
    },
  },
});