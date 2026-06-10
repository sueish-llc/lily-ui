import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const TextLines: Story = {
  render: () => (
    <div style={{ maxWidth: 280 }}>
      <Skeleton lines={3} />
    </div>
  ),
};

export const MediaCard: Story = {
  render: () => (
    <div className="lily-flex lily-gap-3 lily-items-center" style={{ maxWidth: 320 }}>
      <Skeleton variant="circle" width={48} height={48} />
      <div style={{ flex: 1 }}>
        <Skeleton lines={2} />
      </div>
    </div>
  ),
};
