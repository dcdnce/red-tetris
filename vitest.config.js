import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environmentMatchGlobs: [
      ['client/test/**', 'jsdom'],
      ['server/test/**', 'node'],
    ],
    setupFiles: [
      './vitest.setup.js',            // backend + global
      // './client/test/setupClientTests.js',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: [
        'server/src/**/*.js',
        'client/src/**/*.{js,jsx}'
      ],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/*.test.{js,jsx}',
        'client/src/main.jsx',
      ],
      thresholds: {
        statements: 70,
        branches: 50,
        functions: 70,
        lines: 70,
      },
    },
  },
});