import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Badge' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

export const Statuses: Story = {
  render: () => (
    <div className="lily-flex lily-gap-2 lily-items-center">
      {(['primary', 'danger', 'success', 'warning', 'info', 'neutral'] as const).map((s) => (
        <Badge key={s} status={s}>
          {s}
        </Badge>
      ))}
    </div>
  ),
};

export const Subtle: Story = { args: { status: 'success', subtle: true, children: 'subtle' } };
export const Pill: Story = { args: { status: 'danger', pill: true, children: '9' } };
