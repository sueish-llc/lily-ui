import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ maxWidth: 320 }}>
        <p>{t('Section above', '上のセクション')}</p>
        <Divider />
        <p>{t('Section below', '下のセクション')}</p>
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ maxWidth: 320 }}>
        <Divider>{t('or', 'または')}</Divider>
      </div>
    );
  },
};

export const Vertical: Story = {
  render: () => (
    <div className="lily-flex lily-items-center lily-gap-2">
      <span>A</span>
      <Divider orientation="vertical" />
      <span>B</span>
      <Divider orientation="vertical" />
      <span>C</span>
    </div>
  ),
};
