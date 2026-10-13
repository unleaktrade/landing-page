import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { buildCsp } from './src/seo/csp';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      // Production CSP <meta>, build only (see src/seo/csp.ts for the policy).
      name: 'inject-csp',
      apply: 'build',
      // Right after <meta charset>, which must stay in the first 1024 bytes,
      // and before any script, which the policy would not cover otherwise.
      transformIndexHtml: (html) => {
        const charset = '<meta charset="UTF-8" />';
        if (!html.includes(charset)) throw new Error('inject-csp: index.html has no <meta charset="UTF-8" />');
        return html.replace(
          charset,
          `${charset}\n    <meta http-equiv="Content-Security-Policy" content="${buildCsp()}" />`,
        );
      },
    },
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
