import type { Meta, StoryObj } from '@storybook/react';
import { Splitter } from './Splitter';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Layout/Splitter',
  component: Splitter,
  tags: ['autodocs'],
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof Splitter>;

export const Horizontal: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ height: 200, border: '1px solid var(--lily-color-border-default)' }}>
        <Splitter
          defaultSize={35}
          start={<div className="lily-p-3">{t('Sidebar', 'サイドバー')}</div>}
          end={<div className="lily-p-3">{t('Main', 'メイン')}</div>}
        />
      </div>
    );
  },
};

export const Vertical: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ height: 300, border: '1px solid var(--lily-color-border-default)' }}>
        <Splitter
          orientation="vertical"
          defaultSize={40}
          start={<div className="lily-p-3">{t('Top', '上')}</div>}
          end={<div className="lily-p-3">{t('Bottom', '下')}</div>}
        />
      </div>
    );
  },
};
