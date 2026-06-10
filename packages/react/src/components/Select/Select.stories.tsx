import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import { FormField } from '../FormField';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <FormField label={t('Country', '国')}>
        <Select>
          <option value="jp">{t('Japan', '日本')}</option>
          <option value="us">{t('USA', '米国')}</option>
        </Select>
      </FormField>
    );
  },
};
