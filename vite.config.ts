/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { resolve } from 'path';

// Base is './' so the built game runs at file:// (Constitution IV)
export default defineConfig({
  base: './',
  publicDir: 'public',
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    assetsInlineLimit: 0,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
});
