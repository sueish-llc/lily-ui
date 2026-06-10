import type { Meta, StoryObj } from '@storybook/react';
import { Countdown } from './Countdown';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Data Display/Countdown',
  component: Countdown,
  tags: ['autodocs'],
} satisfies Meta<typeof Countdown>;

export default meta;
type Story = StoryObj<typeof Countdown>;

/** Target 24 hours from the story load time. */
function inHours(h: number): string {
  return Temporal.Now.plainDateTimeISO().add({ hours: h }).toString();
}

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Countdown
        to={inHours(24)}
        aria-label={t('Countdown to deadline', '締め切りまでのカウントダウン')}
      />
    );
  },
};

export const HoursMinutesSeconds: Story = {
  render: () => <Countdown to={inHours(3)} format="hms" />,
};

export const NearlyDone: Story = {
  render: () => <Countdown to={Temporal.Now.plainDateTimeISO().add({ seconds: 10 })} />,
};

export const AlreadyExpired: Story = {
  render: () => <Countdown to={Temporal.Now.plainDateTimeISO().subtract({ hours: 1 })} live={false} />,
};
