import type { Meta, StoryObj } from '@storybook/react';
import { CopyButton } from './CopyButton';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Actions/Copy Button',
  component: CopyButton,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof CopyButton>;

/** Icon-only: copies the value, then shows a check. */
export const IconOnly: Story = {
  args: { value: '--lily-color-primary-100' },
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <CopyButton {...args} copyLabel={t('Copy', 'コピー')} copiedLabel={t('Copied', 'コピーしました')} />;
  },
};

/** With a visible label. */
export const WithLabel: Story = {
  args: { value: '#d22879' },
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <CopyButton {...args} label={t('Copy', 'コピー')} copiedLabel={t('Copied', 'コピーしました')} />
    );
  },
};
