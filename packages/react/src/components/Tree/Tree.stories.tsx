import type { Meta, StoryObj } from '@storybook/react';
import { Tree } from './Tree';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Navigation/Tree',
  component: Tree,
  tags: ['autodocs'],
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof Tree>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Tree
        aria-label={t('Files', 'ファイル')}
        defaultExpanded={['src']}
        defaultSelected="index"
        nodes={[
          {
            id: 'src',
            label: 'src',
            children: [
              { id: 'index', label: 'index.ts' },
              { id: 'app', label: 'app.tsx' },
              { id: 'components', label: 'components', children: [{ id: 'button', label: 'Button.tsx' }] },
            ],
          },
          { id: 'readme', label: 'README.md' },
        ]}
      />
    );
  },
};
