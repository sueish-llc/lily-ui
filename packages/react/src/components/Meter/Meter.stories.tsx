import type { Meta, StoryObj } from '@storybook/react';
import { Meter } from './Meter';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Feedback/Meter',
  component: Meter,
  tags: ['autodocs'],
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof Meter>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ maxWidth: 320 }}>
        <Meter label={t('Storage', 'ストレージ')} value={45} valueText="45GB / 100GB" showValue />
      </div>
    );
  },
};

export const Thresholds: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div className="lily-vstack lily-gap-3" style={{ maxWidth: 320 }}>
        <Meter label={t('Storage', 'ストレージ')} value={45} valueText="45%" showValue />
        <Meter label={t('Memory', 'メモリ')} value={82} valueText="82%" status="warning" showValue />
        <Meter label={t('Quota', 'クォータ')} value={97} valueText="97%" status="danger" showValue />
      </div>
    );
  },
};
