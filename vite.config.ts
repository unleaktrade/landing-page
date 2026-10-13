import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { buildCsp, cspPlugin } from './src/seo/csp';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    // Production CSP <meta>, build only (see src/seo/csp.ts).
    cspPlugin(buildCsp()),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
});
