import type { Meta, StoryObj } from '@storybook/react';
import { makeT, type StoryLocale } from '../../../packages/react/src/storybook/i18n';

// The catalog cover. A story (not MDX) so it follows the Language toolbar like
// every other page.
const meta = {
  title: 'Introduction',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const v = (name: string) => `var(--lily-${name})`;

export const Overview: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    const item = (label: string, body: string) => (
      <li key={label} style={{ marginBottom: v('space-2') }}>
        <strong>{label}</strong>
        {t(': ', '：')}
        {body}
      </li>
    );
    return (
      <div
        style={{
          padding: v('space-10'),
          maxWidth: '46rem',
          margin: '0 auto',
          color: v('color-fg-default'),
          lineHeight: v('leading-relaxed'),
        }}
      >
        <h1 style={{ fontSize: v('text-4xl'), fontWeight: v('weight-extrabold'), margin: 0 }}>
          Lily UI
        </h1>
        <p style={{ color: v('color-fg-muted'), maxWidth: '60ch' }}>
          {t(
            'A design system in the soft, warm colors of 笹百合 (sasayuri lily) rose and 藤 (fuji wisteria) violet. It looks and behaves the same across React, Vue, and Web Components, and the palette meets WCAG 2.1 AAA (7:1 contrast).',
            '笹百合（ささゆり）のローズと藤（ふじ）の菫色でまとめた、和の色合いのデザインシステムです。React・Vue・Web Components のどれでも同じ見た目と操作感になり、配色は WCAG 2.1 AAA（コントラスト 7:1）を満たします。',
          )}
        </p>

        <h2 style={{ fontSize: v('text-xl'), fontWeight: v('weight-bold'), marginTop: v('space-8') }}>
          {t('Using the toolbar', '使い方')}
        </h2>
        <p>{t('Switch what you see from the toolbar above.', '上のツールバーで表示を切り替えられます。')}</p>
        <ul style={{ paddingInlineStart: v('space-5'), maxWidth: '60ch' }}>
          {item(
            t('Theme', 'テーマ'),
            t('light and dark — it opens in your OS scheme to start.', 'ライトとダーク。最初は OS の設定に合わせて開きます。'),
          )}
          {item(
            t('Framework', 'フレームワーク'),
            t(
              'switch React / Vue / Web Components in the cross-framework demos.',
              '横断デモで React / Vue / Web Components を切り替えます。',
            ),
          )}
          {item(
            t('Language', '言語'),
            t('check wrapping and wording in Japanese and English.', '日本語と英語で、文章の折り返しや表記を確かめられます。'),
          )}
          {item(
            t('Motion', '動き'),
            t('switch the amount of animation between Full / Minimal / None.', 'アニメーションの量を Full / Minimal / None で切り替えます。'),
          )}
        </ul>
        <p style={{ color: v('color-fg-muted'), maxWidth: '60ch' }}>
          {t(
            'The sidebar is organized by component role (Foundations, Forms, Navigation, and so on).',
            '左のサイドバーは、コンポーネントの役割ごとに並んでいます（Foundations、Forms、Navigation など）。',
          )}
        </p>

        <h2 style={{ fontSize: v('text-xl'), fontWeight: v('weight-bold'), marginTop: v('space-8') }}>
          {t('Brand site', 'ブランドサイト')}
        </h2>
        <p>
          {t('The design thinking and base tokens live on the ', '設計の考え方や基礎トークンは')}
          <a href="../" target="_top" style={{ color: v('color-primary-text'), fontWeight: v('weight-bold') }}>
            {t('brand site', 'ブランドサイト')}
          </a>
          {t('.', 'にまとめています。')}
        </p>
      </div>
    );
  },
};
