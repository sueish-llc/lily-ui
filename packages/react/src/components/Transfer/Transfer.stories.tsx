import type { Meta, StoryObj } from '@storybook/react';
import { Transfer } from './Transfer';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Transfer',
  component: Transfer,
  tags: ['autodocs'],
} satisfies Meta<typeof Transfer>;

export default meta;
type Story = StoryObj<typeof Transfer>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Transfer
        titles={[t('Available', '候補'), t('Selected', '選択済み')]}
        defaultValue={['vue']}
        items={[
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
          { value: 'svelte', label: 'Svelte' },
          { value: 'solid', label: 'Solid' },
        ]}
      />
    );
  },
};
