import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from './DateRangePicker';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Date Range Picker',
  component: DateRangePicker,
  tags: ['autodocs'],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

// Built on the Temporal-powered DatePicker; values are Temporal.PlainDate tuples.
export const Default: Story = {
  render: (_args, { globals }) => {
    const locale = globals.locale as StoryLocale;
    const t = makeT(locale);
    return (
      <DateRangePicker
        startLabel={t('Start date', '開始日')}
        endLabel={t('End date', '終了日')}
        locale={locale === 'ja' ? 'ja-JP' : 'en-US'}
      />
    );
  },
};
