import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';
import { today } from '../../utils/datetime';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof Calendar>;

// The value is a Temporal.PlainDate — the library models all date/time with Temporal.
export const Default: Story = {
  render: (_args, { globals }) => {
    const locale = globals.locale as StoryLocale;
    const t = makeT(locale);
    return <Calendar defaultValue={today()} locale={locale === 'ja' ? 'ja-JP' : 'en-US'} aria-label={t('Choose a date', '日付を選択')} />;
  },
};
