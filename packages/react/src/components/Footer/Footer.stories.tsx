import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';
import { Link } from '../Link';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Layout/Footer',
  component: Footer,
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Footer>
        <p style={{ margin: 0 }}>© 2026 Lily UI</p>
        <nav aria-label={t('Footer', 'フッター')} style={{ display: 'flex', gap: '1rem' }}>
          <Link href="#terms">{t('Terms', '利用規約')}</Link>
          <Link href="#privacy">{t('Privacy', 'プライバシー')}</Link>
          <Link href="#contact">{t('Contact', 'お問い合わせ')}</Link>
        </nav>
      </Footer>
    );
  },
};
