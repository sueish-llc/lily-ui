import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';
import { FormField } from '../FormField';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { rows: 3, 'aria-label': 'Bio' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const InFormField: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <FormField label={t('Bio', '自己紹介')}>
        <Textarea rows={4} />
      </FormField>
    );
  },
};
