import type { Meta, StoryObj } from '@storybook/react';
import { RelativeTime } from './RelativeTime';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Data Display/Relative Time',
  component: RelativeTime,
  tags: ['autodocs'],
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof RelativeTime>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    const twoHoursAgo = Temporal.Now.instant().subtract({ seconds: 7200 });
    return (
      <RelativeTime
        value={twoHoursAgo}
        locale={globals.locale as string}
        aria-label={t('2 hours ago', '2時間前')}
      />
    );
  },
};

export const Live: Story = {
  render: (_args, { globals }) => (
    <RelativeTime
      value={Temporal.Now.instant().subtract({ seconds: 55 })}
      locale={globals.locale as string}
      live
      updateInterval={5000}
    />
  ),
};

export const AlwaysNumeric: Story = {
  render: (_args, { globals }) => {
    const yesterday = Temporal.Now.instant().subtract({ seconds: 86400 });
    return (
      <RelativeTime
        value={yesterday}
        locale={globals.locale as string}
        numeric="always"
      />
    );
  },
};

export const PlainDate: Story = {
  render: (_args, { globals }) => (
    <RelativeTime
      value={Temporal.PlainDate.from('2025-01-01')}
      locale={globals.locale as string}
    />
  ),
};

export const Future: Story = {
  render: (_args, { globals }) => {
    const nextWeek = Temporal.Now.instant().add({ seconds: 60 * 60 * 24 * 7 });
    return (
      <RelativeTime
        value={nextWeek}
        locale={globals.locale as string}
      />
    );
  },
};
