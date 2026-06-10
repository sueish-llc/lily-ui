import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from './Rating';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Rating',
  component: Rating,
  tags: ['autodocs'],
  args: { defaultValue: 3 },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <Rating {...args} label={t('Rating', '評価')} />;
  },
};

export const ReadOnly: Story = { args: { value: 4, readOnly: true } };

export const Sizes: Story = {
  render: () => (
    <div className="lily-vstack lily-gap-2">
      <Rating label="sm" size="sm" defaultValue={2} />
      <Rating label="md" defaultValue={3} />
      <Rating label="lg" size="lg" defaultValue={4} />
    </div>
  ),
};
