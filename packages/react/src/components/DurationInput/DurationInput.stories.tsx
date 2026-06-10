import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DurationInput } from './DurationInput';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Duration Input',
  component: DurationInput,
  tags: ['autodocs'],
} satisfies Meta<typeof DurationInput>;

export default meta;
type Story = StoryObj<typeof DurationInput>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <DurationInput
        defaultValue={Temporal.Duration.from({ hours: 1, minutes: 30 })}
        hoursLabel={t('Hours', '時間')}
        minutesLabel={t('Minutes', '分')}
      />
    );
  },
};

export const WithSeconds: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <DurationInput
        withSeconds
        defaultValue={Temporal.Duration.from({ hours: 0, minutes: 5, seconds: 30 })}
        hoursLabel={t('Hours', '時間')}
        minutesLabel={t('Minutes', '分')}
        secondsLabel={t('Seconds', '秒')}
      />
    );
  },
};

function DurationControlledExample({
  hoursLabel,
  minutesLabel,
}: {
  hoursLabel: string;
  minutesLabel: string;
}) {
  const [dur, setDur] = useState<Temporal.Duration | null>(
    Temporal.Duration.from({ hours: 2, minutes: 0 }),
  );
  return (
    <div>
      <DurationInput
        value={dur}
        onChange={setDur}
        hoursLabel={hoursLabel}
        minutesLabel={minutesLabel}
      />
      <p style={{ marginTop: '0.5rem', fontSize: 'var(--lily-text-sm)' }}>
        {dur ? `PT${dur.hours}H${dur.minutes}M` : '—'}
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <DurationControlledExample hoursLabel={t('Hours', '時間')} minutesLabel={t('Minutes', '分')} />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <DurationInput
      disabled
      defaultValue={Temporal.Duration.from({ hours: 1, minutes: 15 })}
    />
  ),
};

export const SizeSmall: Story = {
  render: () => (
    <DurationInput size="sm" defaultValue={Temporal.Duration.from({ hours: 0, minutes: 45 })} />
  ),
};

export const SizeLarge: Story = {
  render: () => (
    <DurationInput size="lg" defaultValue={Temporal.Duration.from({ hours: 3, minutes: 0 })} />
  ),
};
