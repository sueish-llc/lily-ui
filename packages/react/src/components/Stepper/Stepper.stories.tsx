import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Horizontal: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Stepper
        active={1}
        steps={[
          { label: t('Cart', 'カート') },
          { label: t('Shipping', '配送'), description: t('Enter address', '住所の入力') },
          { label: t('Review', '確認') },
        ]}
      />
    );
  },
};

export const Vertical: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Stepper
        orientation="vertical"
        active={2}
        steps={[
          { label: t('Apply', '申込') },
          { label: t('Review', '審査') },
          { label: t('Done', '完了'), status: 'current' },
        ]}
      />
    );
  },
};
