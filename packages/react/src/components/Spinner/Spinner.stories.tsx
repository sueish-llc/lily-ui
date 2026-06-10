import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Sizes: Story = {
  render: () => (
    <div className="lily-flex lily-gap-4 lily-items-center">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" />
      <Spinner variant="grow" />
    </div>
  ),
};
