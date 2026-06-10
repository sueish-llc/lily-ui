import type { Meta, StoryObj } from '@storybook/react';
import { BackTop } from './BackTop';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Navigation/Back to Top',
  component: BackTop,
  tags: ['autodocs'],
} satisfies Meta<typeof BackTop>;

export default meta;
type Story = StoryObj<typeof BackTop>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div>
        <p>{t('Scroll down — a button appears in the corner.', 'ページ下部までスクロールすると、右下にボタンが現れます。')}</p>
        <div style={{ height: 1500 }} />
        <BackTop visibilityHeight={100} label={t('Back to top', 'トップへ戻る')} />
      </div>
    );
  },
};
