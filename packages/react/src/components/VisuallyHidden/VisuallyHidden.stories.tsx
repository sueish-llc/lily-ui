import type { Meta, StoryObj } from '@storybook/react';
import { VisuallyHidden } from './VisuallyHidden';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Layout/Visually Hidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <p>
        {t('Visible text', '見える文字')}
        <VisuallyHidden>{t(' (hidden label for screen readers)', '（スクリーンリーダー向けの非表示ラベル）')}</VisuallyHidden>
      </p>
    );
  },
};

export const Focusable: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div>
        <VisuallyHidden as="a" focusable href="#main-content">
          {t('Skip to main content', 'メインコンテンツへスキップ')}
        </VisuallyHidden>
        <p id="main-content">
          {t(
            'Tab into this example to see the skip link appear.',
            'この例にタブで入ると、スキップリンクが現れます。',
          )}
        </p>
      </div>
    );
  },
};
