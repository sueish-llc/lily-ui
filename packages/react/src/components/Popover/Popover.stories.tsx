import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Popover title={t('More info', '詳細情報')} content={<p>{t('This is a popover with rich content.', '中に好きな内容を置けるポップオーバーです。')}</p>}>
        <Button>{t('Show popover', 'ポップオーバーを表示')}</Button>
      </Popover>
    );
  },
};
