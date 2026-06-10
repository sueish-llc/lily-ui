// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';

// GitHub Pages serves the project site under /<repo>/. Both values can be
// overridden from the deploy workflow via env so the same build works on a
// custom domain or a local preview at the root.
const site = process.env.SITE_URL ?? 'https://sueish-llc.github.io';
const base = process.env.BASE_PATH ?? '/lily-ui';
// Lets the deploy workflow emit into a shared output directory. Defaults to the
// app-local dist/ otherwise.
const outDir = process.env.DOCS_OUT_DIR ?? './dist';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  outDir,
  trailingSlash: 'always',
  build: { format: 'directory' },
  // React owns .tsx by default; scope Vue to .vue files so the two renderers
  // never fight over the same extension.
  integrations: [react(), vue({ jsx: false })],
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  vite: {
    css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
    // The lily packages ship Temporal-typed components; provide the polyfill so
    // anything pulled in at build/SSR time on Node < 26 still resolves.
    optimizeDeps: { include: ['temporal-polyfill'] },
  },
});
