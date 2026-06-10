import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Stack } from './Stack';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof Stack>;

const Box = ({ children }: { children: ReactNode }) => (
  <div className="lily-p-3 lily-bg-subtle lily-rounded-md" style={{ textAlign: 'center' }}>
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <Stack gap="4">
      <Stack direction="horizontal" gap="2">
        <Box>A</Box>
        <Box>B</Box>
        <Box>C</Box>
      </Stack>
      <Box>vertical item</Box>
      <Box>vertical item</Box>
    </Stack>
  ),
};
