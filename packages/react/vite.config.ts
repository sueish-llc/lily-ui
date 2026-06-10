/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * @lily-ui/react library build.
 *
 * - ESM (`.js`) + CJS (`.cjs`) output with `preserveModules`: one file per
 *   source module (mirroring `src/`), so bundlers tree-shake at module
 *   granularity — importing `Button` does not ship every other component.
 * - react / react-dom / @lily-ui/css are externalized (peer dependencies):
 *   the React package contains no styles itself.
 */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        tokens: resolve(__dirname, 'src/tokens/index.ts'),
      },
      formats: ['es', 'cjs'],
      // With preserveModules every module is an entry chunk; `name` is its
      // path relative to `preserveModulesRoot` (e.g. components/Button/Button).
      fileName: (format, name) => `${name}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /^@lily-ui\/css/,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
