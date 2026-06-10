import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from './Menu';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Navigation/Menu',
  component: Menu,
  tags: ['autodocs'],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ width: 220 }}>
        <Menu
          aria-label={t('File actions', 'ファイル操作')}
          items={[
            { label: t('Open', '開く'), value: 'open', shortcut: '⌘O' },
            { label: t('Duplicate', '複製'), value: 'dup', shortcut: '⌘D' },
            { divider: true },
            { label: t('Delete', '削除'), value: 'delete', disabled: true },
          ]}
        />
      </div>
    );
  },
};
