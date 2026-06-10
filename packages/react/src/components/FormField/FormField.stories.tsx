import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { Input } from '../Input';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Form Field',
  component: FormField,
  tags: ['autodocs'],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof FormField>;

export const States: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <form style={{ maxWidth: 360 }} className="lily-vstack lily-gap-3">
        <FormField label={t('Name', '名前')} help={t('Your full name', 'フルネーム')} required>
          <Input placeholder="Ada Lovelace" />
        </FormField>
        <FormField label={t('Email', 'メール')} error={t('Please enter a valid email', '有効なメールを入力してください')}>
          <Input type="email" defaultValue="bad" />
        </FormField>
      </form>
    );
  },
};
