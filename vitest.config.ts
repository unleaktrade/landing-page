import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'figma:asset/fdbafc2f1e7edb4d213deafbca8c80c666dccbae.png': path.resolve(__dirname, './src/assets/fdbafc2f1e7edb4d213deafbca8c80c666dccbae.png'),
      'figma:asset/af0a6579392a99988c0ab693570446ed86a64fec.png': path.resolve(__dirname, './src/assets/af0a6579392a99988c0ab693570446ed86a64fec.png'),
      'figma:asset/77164cc6a58e276f88505209efc62dfe8b57b786.png': path.resolve(__dirname, './src/assets/77164cc6a58e276f88505209efc62dfe8b57b786.png'),
      'figma:asset/524423e86081819620c9996fd40046b079ec4ba8.png': path.resolve(__dirname, './src/assets/524423e86081819620c9996fd40046b079ec4ba8.png'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/components/ui/**',
        'src/components/figma/**',
        'src/assets/**',
        'src/styles/**',
        'src/guidelines/**',
        'src/test/**',
        'src/main.tsx',
        'src/**/*.d.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
