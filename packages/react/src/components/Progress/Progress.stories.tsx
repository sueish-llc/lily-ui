import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div className="lily-vstack lily-gap-3">
        <Progress value={25} label="25%" showLabel />
        <Progress value={60} striped label="60%" showLabel />
        <Progress value={100} label={t('Done', '完了')} showLabel />
      </div>
    );
  },
};
