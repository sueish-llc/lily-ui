import type { Meta, StoryObj } from '@storybook/react';
import { Affix } from './Affix';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Layout/Affix',
  component: Affix,
  tags: ['autodocs'],
} satisfies Meta<typeof Affix>;

export default meta;
type Story = StoryObj<typeof Affix>;

export const Sticky: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ height: 400, overflow: 'auto', border: '1px solid var(--lily-color-border-default)' }}>
        <Affix offset={0}>
          <div className="lily-bg-surface lily-p-3">{t('Sticky toolbar', '追従ツールバー')}</div>
        </Affix>
        <div style={{ height: 1200, padding: 16 }}>{t('Scroll…', 'スクロール…')}</div>
      </div>
    );
  },
};
