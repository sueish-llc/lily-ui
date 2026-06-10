import type { Meta, StoryObj } from '@storybook/react';
import { Toolbar } from './Toolbar';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Actions/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Toolbar aria-label={t('Text formatting', 'テキスト書式')}>
        <Button variant="ghost" size="sm">
          {t('Bold', '太字')}
        </Button>
        <Button variant="ghost" size="sm">
          {t('Italic', '斜体')}
        </Button>
        <Button variant="ghost" size="sm">
          {t('Underline', '下線')}
        </Button>
      </Toolbar>
    );
  },
};

export const Vertical: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Toolbar orientation="vertical" aria-label={t('Actions', 'アクション')}>
        <Button variant="ghost" size="sm">
          {t('Cut', '切り取り')}
        </Button>
        <Button variant="ghost" size="sm">
          {t('Copy', 'コピー')}
        </Button>
        <Button variant="ghost" size="sm">
          {t('Paste', '貼り付け')}
        </Button>
      </Toolbar>
    );
  },
};
