import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/**
 * @lily-ui/web-components library build.
 *
 * - ESM (`.js`) + CJS (`.cjs`) output with `preserveModules`: one file per
 *   source module (mirroring `src/`), so bundlers tree-shake at module
 *   granularity — importing one element does not ship every other component.
 * - `@lily-ui/css` is externalized (peer dependency): the package ships no
 *   styles, only custom-element definitions that render Lily class names.
 */
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        define: resolve(__dirname, 'src/define.ts'),
        tokens: resolve(__dirname, 'src/tokens/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, name) => `${name}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    sourcemap: true,
    rollupOptions: {
      external: [/^@lily-ui\/css/],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
});
