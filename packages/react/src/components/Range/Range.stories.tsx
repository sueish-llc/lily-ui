import type { Meta, StoryObj } from '@storybook/react';
import { Range } from './Range';
import { FormField } from '../FormField';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Range',
  component: Range,
  tags: ['autodocs'],
} satisfies Meta<typeof Range>;

export default meta;
type Story = StoryObj<typeof Range>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <FormField label={t('Volume', '音量')}>
        <Range min={0} max={100} defaultValue={40} />
      </FormField>
    );
  },
};
