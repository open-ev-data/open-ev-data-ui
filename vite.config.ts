import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: '/open-ev-data-ui/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**', '**/tests-examples/**'],
  },
  server: {
    proxy: {
      '/api/github': {
        target: 'https://api.github.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/github/, ''),
      },
      '/proxy-github-release': {
        target: 'https://github.com',
        changeOrigin: true,
        followRedirects: true,
        rewrite: (path) => path.replace(/^\/proxy-github-release/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (_proxyRes, _req, res) => {
            // Allow all origins during development
            res.setHeader('Access-Control-Allow-Origin', '*');
          });
        },
      },
    },
  },
});
