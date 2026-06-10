import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const here = dirname(fileURLToPath(import.meta.url));
/** Resolve a path inside the monorepo's `packages/` dir. */
const pkg = (p: string) => resolve(here, '../../../packages', p);

const config: StorybookConfig = {
  // Stories are co-located in each package's src directory, plus the
  // cross-framework demo stories under this app.
  stories: [
    '../../../packages/*/src/**/*.mdx',
    '../../../packages/*/src/**/*.stories.@(ts|tsx)',
    '../stories/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    // Runs axe-core in the Storybook UI so a11y issues are visible per story.
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: { autodocs: 'tag' },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  // The React renderer also hosts the Vue + Web Components implementations (see
  // ../src/multiframework.tsx). We compile the sibling packages from source so
  // edits show up live, which means teaching this Vite config about `.vue`
  // files and aliasing the workspace packages to their source entries.
  async viteFinal(viteConfig) {
    const { default: vue } = await import('@vitejs/plugin-vue');
    viteConfig.plugins = viteConfig.plugins ?? [];
    viteConfig.plugins.push(vue());
    // When published under a subpath (e.g. GitHub Pages at
    // /lily-ui/storybook/), the preview iframe's assets must resolve
    // against that base. Defaults to '/' so local dev and root hosting are
    // unaffected. Set STORYBOOK_BASE_PATH at build time to the subpath.
    viteConfig.base = process.env.STORYBOOK_BASE_PATH ?? '/';
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias as Record<string, string> | undefined),
      '@lily-ui/vue': pkg('vue/src/index.ts'),
      '@lily-ui/web-components': pkg('web-components/src/index.ts'),
    };
    return viteConfig;
  },
};

export default config;
