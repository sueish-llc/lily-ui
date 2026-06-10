import type { Meta, StoryObj } from '@storybook/react';
import { NumberInput } from './NumberInput';
import { FormField } from '../FormField';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Number Input',
  component: NumberInput,
  tags: ['autodocs'],
  args: { min: 0, max: 99, defaultValue: 1 },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <NumberInput {...args} aria-label={t('Quantity', '数量')} />;
  },
};

export const InFormField: Story = {
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <FormField label={t('Quantity', '数量')}>
        <NumberInput {...args} />
      </FormField>
    );
  },
};
