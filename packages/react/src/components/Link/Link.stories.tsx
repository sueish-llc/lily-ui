import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';
import { Text } from '../Typography';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Typography/Link',
  component: Link,
  tags: ['autodocs'],
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <Link href="#">{t('Documentation', 'ドキュメント')}</Link>;
  },
};

export const InText: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Text>
        {t('This is an ', 'これは ')}
        <Link href="#docs">{t('internal link', '内部リンク')}</Link>
        {t(', this is an ', '、こちらは ')}
        <Link href="https://example.com" external>
          {t('external link', '外部リンク')}
        </Link>
        {t(', and this is a ', '、そして ')}
        <Link href="#err" status="danger">
          {t('dangerous action', '危険な操作')}
        </Link>
        {t('.', ' です。')}
      </Text>
    );
  },
};

export const Quiet: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Link quiet href="#">
        {t('A quiet link', '控えめなリンク')}
      </Link>
    );
  },
};
