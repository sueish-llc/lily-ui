import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <Checkbox label={t('Accept the terms', '規約に同意する')} defaultChecked />;
  },
};
