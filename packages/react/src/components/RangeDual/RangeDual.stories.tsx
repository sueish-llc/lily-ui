import type { Meta, StoryObj } from '@storybook/react';
import { RangeDual } from './RangeDual';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Range (Dual)',
  component: RangeDual,
  tags: ['autodocs'],
  args: { min: 0, max: 1000, step: 10, defaultValue: [200, 800] },
} satisfies Meta<typeof RangeDual>;

export default meta;
type Story = StoryObj<typeof RangeDual>;

export const Default: Story = {
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ maxWidth: 360 }}>
        <RangeDual
          {...args}
          minLabel={t('Min price', '下限価格')}
          maxLabel={t('Max price', '上限価格')}
        />
      </div>
    );
  },
};
