import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from './Carousel';

const meta = {
  title: 'Media/Carousel',
  component: Carousel,
  tags: ['autodocs'],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Carousel
        label="Demo"
        slides={['#06c755', '#2563eb', '#e89c0c'].map((c) => (
          <div key={c} style={{ height: 200, background: c, display: 'grid', placeItems: 'center', color: '#fff' }}>
            {c}
          </div>
        ))}
      />
    </div>
  ),
};
