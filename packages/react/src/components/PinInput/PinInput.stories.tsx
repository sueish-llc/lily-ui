import type { Meta, StoryObj } from '@storybook/react';
import { PinInput } from './PinInput';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Pin Input',
  component: PinInput,
  tags: ['autodocs'],
} satisfies Meta<typeof PinInput>;

export default meta;
type Story = StoryObj<typeof PinInput>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <PinInput length={6} label={t('Verification code', '認証コード')} />;
  },
};

export const Masked: Story = { args: { length: 4, mask: true, label: 'PIN' } };

export const TextMode: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <PinInput length={5} type="text" label={t('Code', 'コード')} />;
  },
};
