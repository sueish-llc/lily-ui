import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { FormField } from '../FormField';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  args: { placeholder: 'Ada Lovelace' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <Input {...args} aria-label={t('Name', '名前')} />;
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="lily-vstack lily-gap-2" style={{ maxWidth: 320 }}>
      <Input size="sm" aria-label="sm" placeholder="small" />
      <Input aria-label="md" placeholder="medium" />
      <Input size="lg" aria-label="lg" placeholder="large" />
    </div>
  ),
};

export const InFormField: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <FormField label={t('Name', 'お名前')}>
        <Input placeholder={t('Taro Yamada', '山田 太郎')} />
      </FormField>
    );
  },
};
