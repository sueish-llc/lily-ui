import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

const getItems = (locale: StoryLocale) => {
  const t = makeT(locale);
  return [
    { id: 'home', label: t('Home', 'ホーム'), content: t('Home panel', 'ホームパネル') },
    { id: 'profile', label: t('Profile', 'プロフィール'), content: t('Profile panel', 'プロフィールパネル') },
    { id: 'settings', label: t('Settings', '設定'), content: t('Settings panel', '設定パネル') },
  ];
};

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <Tabs label={t('Example tabs', 'サンプルタブ')} items={getItems(globals.locale as StoryLocale)} />;
  },
};

export const Pills: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <Tabs variant="pills" label={t('Example tabs', 'サンプルタブ')} items={getItems(globals.locale as StoryLocale)} />;
  },
};
