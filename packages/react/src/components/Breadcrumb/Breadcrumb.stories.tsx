import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Breadcrumb
        items={[
          { label: t('Home', 'ホーム'), href: '#' },
          { label: t('Library', 'ライブラリ'), href: '#' },
          { label: t('Data', 'データ') },
        ]}
      />
    );
  },
};
