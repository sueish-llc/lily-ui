import type { Meta, StoryObj } from '@storybook/react';
import { TagInput } from './TagInput';
import { FormField } from '../FormField';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Tag Input',
  component: TagInput,
  tags: ['autodocs'],
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <TagInput
        aria-label={t('Recipients', '宛先')}
        defaultValue={['ada@example.com']}
        placeholder={t('Type an email and press Enter', 'メールを入力して Enter')}
      />
    );
  },
};

export const InFormField: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <FormField label={t('Recipients', '宛先')}>
        <TagInput defaultValue={['ada@example.com']} />
      </FormField>
    );
  },
};
