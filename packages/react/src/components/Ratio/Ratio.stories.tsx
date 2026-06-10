import type { Meta, StoryObj } from '@storybook/react';
import { Ratio } from './Ratio';

const meta = {
  title: 'Layout/Ratio',
  component: Ratio,
  tags: ['autodocs'],
} satisfies Meta<typeof Ratio>;

export default meta;
type Story = StoryObj<typeof Ratio>;

export const SixteenByNine: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Ratio ratio="16x9">
        <div className="lily-bg-subtle lily-flex lily-items-center lily-justify-center">16x9</div>
      </Ratio>
    </div>
  ),
};
