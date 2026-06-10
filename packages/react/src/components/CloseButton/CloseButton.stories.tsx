import type { Meta, StoryObj } from '@storybook/react';
import { CloseButton } from './CloseButton';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Actions/Close Button',
  component: CloseButton,
  tags: ['autodocs'],
} satisfies Meta<typeof CloseButton>;

export default meta;
type Story = StoryObj<typeof CloseButton>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <CloseButton label={t('Close', '閉じる')} />;
  },
};
