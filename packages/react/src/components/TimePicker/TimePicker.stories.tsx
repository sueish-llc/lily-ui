import type { Meta, StoryObj } from '@storybook/react';
import { TimePicker } from './TimePicker';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Time Picker',
  component: TimePicker,
  tags: ['autodocs'],
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof TimePicker>;

const labels = (locale: StoryLocale) => {
  const t = makeT(locale);
  return { hourLabel: t('Hour', '時'), minuteLabel: t('Minute', '分'), meridiemLabel: t('AM/PM', '午前午後') };
};

// The value is a Temporal.PlainTime — the library models all date/time with Temporal.
export const TwentyFourHour: Story = {
  render: (_args, { globals }) => (
    <TimePicker defaultValue={Temporal.PlainTime.from('09:30')} minuteStep={15} {...labels(globals.locale as StoryLocale)} />
  ),
};

export const TwelveHour: Story = {
  render: (_args, { globals }) => (
    <TimePicker hour12 defaultValue={Temporal.PlainTime.from('13:00')} {...labels(globals.locale as StoryLocale)} />
  ),
};
