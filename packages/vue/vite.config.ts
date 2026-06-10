import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

/**
 * @lily-ui/vue library build.
 *
 * - ESM (`.js`) + CJS (`.cjs`) output with `preserveModules`: one file per
 *   source module (mirroring `src/`), so bundlers tree-shake at module
 *   granularity — importing `Button` does not ship every other component.
 * - vue / @lily-ui/css are externalized (peer dependencies): the Vue package
 *   contains no styles itself.
 */
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        tokens: resolve(__dirname, 'src/tokens/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, name) => `${name}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ['vue', /^@lily-ui\/css/],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
});
