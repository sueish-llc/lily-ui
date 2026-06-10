import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup } from './Avatar';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Initials: Story = { render: () => <Avatar name="Ada Lovelace" /> };

export const Sizes: Story = {
  render: () => (
    <div className="lily-flex lily-gap-3 lily-items-center">
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Ada Lovelace" />
      <Avatar name="Ada Lovelace" size="lg" />
      <Avatar name="Ada Lovelace" size="lg" square />
    </div>
  ),
};

export const WithStatus: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <Avatar name="Grace Hopper" status="success" statusLabel={t('online', 'オンライン')} />;
  },
};

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar name="A B" />
      <Avatar name="C D" />
      <Avatar name="E F" />
      <Avatar name="+2">+2</Avatar>
    </AvatarGroup>
  ),
};
