import type { Meta, StoryObj } from '@storybook/react';
import { Stat } from './Stat';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Data Display/Stat',
  component: Stat,
  tags: ['autodocs'],
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof Stat>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <Stat label={t('Revenue', '売上')} value="¥1.2M" delta="+12%" trend="up" help={t('vs. last month', '前月比')} />;
  },
};

export const Row: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div className="lily-flex lily-gap-6">
        <Stat label={t('Revenue', '売上')} value="¥1.2M" delta="+12%" trend="up" help={t('vs. last month', '前月比')} />
        <Stat label={t('Churn', '解約率')} value="2.4%" delta="-0.3pt" trend="down" help={t('vs. last month', '前月比')} />
        <Stat label={t('Active', 'アクティブ')} value="8,420" />
      </div>
    );
  },
};
