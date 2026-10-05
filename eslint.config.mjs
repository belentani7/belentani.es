import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    ignores: [
      '**/_clones/**',
      '**/Ciclona/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
    ],
  },
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
];