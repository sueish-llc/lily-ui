import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof Pagination>;

function Demo() {
  const [page, setPage] = useState(3);
  return <Pagination count={10} page={page} onChange={setPage} />;
}

export const Default: Story = { render: () => <Demo /> };
