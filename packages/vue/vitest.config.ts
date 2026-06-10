/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

/**
 * Vitest configuration for @lily-ui/vue (the library build lives in
 * vite.config.ts). Mirrors @lily-ui/react: jsdom environment plus a setup file
 * that loads the Temporal polyfill when the runtime lacks the native global.
 */
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts'],
  },
});
