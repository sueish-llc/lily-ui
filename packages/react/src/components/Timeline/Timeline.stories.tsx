import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './Timeline';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Data Display/Timeline',
  component: Timeline,
  tags: ['autodocs'],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Timeline
        items={[
          { title: t('Order received', '注文を受け付けました'), time: '10:00', status: 'success' },
          { title: t('Preparing shipment', '発送準備中'), time: '12:30', status: 'primary' },
          { title: t('Out for delivery', 'お届け予定'), time: t('Tomorrow', '明日'), description: '14:00〜16:00', status: 'neutral' },
        ]}
      />
    );
  },
};
