import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { makeT, type StoryLocale } from '../storybook/i18n';

// =============================================================================
// 彩 (Sai) — design tokens, made visible.
// -----------------------------------------------------------------------------
// Each swatch reads a live CSS custom property (`var(--lily-*)`), so it shows the
// real token value and follows the Storybook light/dark toolbar.
//
// See docs/design-language.md for the spec.
// =============================================================================

const v = (name: string) => `var(--lily-${name})`;

/** A titled section with a short caption. */
function Section({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: v('space-12') }}>
      <h2
        style={{
          fontSize: v('text-2xl'),
          fontWeight: v('weight-bold'),
          marginBottom: caption ? v('space-1') : v('space-4'),
        }}
      >
        {title}
      </h2>
      {caption && (
        <p style={{ color: v('color-fg-muted'), marginBottom: v('space-4'), maxWidth: '60ch' }}>
          {caption}
        </p>
      )}
      {children}
    </section>
  );
}

/** A color swatch that displays its own token name + computed value. */
function Swatch({
  token,
  label,
  fg = 'color-fg-default',
}: {
  token: string;
  label?: string;
  fg?: string;
}) {
  return (
    <div
      style={{
        background: v(token),
        color: v(fg),
        borderRadius: v('radius-lg'),
        border: `1px solid ${v('color-border-default')}`,
        padding: v('space-4'),
        minHeight: '4.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        boxShadow: v('shadow-sm'),
      }}
    >
      <span style={{ fontSize: v('text-sm'), fontWeight: v('weight-bold') }}>{label ?? token}</span>
      <code style={{ fontSize: v('text-xs'), opacity: 0.75 }}>--lily-{token}</code>
    </div>
  );
}

const grid = (min = '12rem'): CSSProperties => ({
  display: 'grid',
  gap: v('space-3'),
  gridTemplateColumns: `repeat(auto-fill, minmax(${min}, 1fr))`,
});

const meta = {
  title: 'Foundations/彩 (Sai)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '彩（さい）のデザイントークンを一覧するページです。色・形・文字・密度を実際の CSS 変数で表示します。ツールバーの Theme で light / dark を切り替えられます。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** One-screen overview of the tokens in use. */
export const Overview: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ padding: v('space-8'), maxWidth: '64rem', margin: '0 auto' }}>
        {/* Hero — the signature gradient, used exactly once. */}
        <div
          style={{
            background: v('color-accent-gradient'),
            color: v('color-on-accent'),
            borderRadius: v('radius-2xl'),
            padding: v('space-12'),
            marginBottom: v('space-10'),
            boxShadow: v('shadow-lg'),
          }}
        >
          <p style={{ fontSize: v('text-sm'), fontWeight: v('weight-bold'), opacity: 0.85 }}>
            {t('Lily UI design language', 'Lily UI のデザイン言語')}
          </p>
          <h1
            style={{
              fontSize: v('text-5xl'),
              fontWeight: v('weight-extrabold'),
              lineHeight: v('leading-tight'),
              margin: `${v('space-2')} 0`,
            }}
          >
            {t('彩 (Sai). Soft and warm.', '彩。やわらかく、あたたかく。')}
          </h1>
          <p style={{ fontSize: v('text-lg'), maxWidth: '40ch', lineHeight: v('leading-relaxed') }}>
            {t(
              'A friendly design system, designed from the experience of reading Japanese. Easy to read, easy to use without second-guessing, and the same on every screen.',
              '日本語を読むことから考えた、親しみやすいデザインシステムです。見やすくて、迷わず使えて、どの画面でも同じ表情をしています。',
            )}
          </p>
          <div
            style={{ display: 'flex', gap: v('space-3'), marginTop: v('space-6'), flexWrap: 'wrap' }}
          >
            <Button status="primary" size="lg">
              {t('Get started', 'はじめる')}
            </Button>
            <Button variant="outline" size="lg">
              {t('Docs', 'ドキュメント')}
            </Button>
          </div>
        </div>

        {/* A realistic card cluster showing surfaces + accents working together. */}
        <div style={grid('18rem')}>
          <Card>
            <Card.Body>
              <div style={{ display: 'flex', gap: v('space-2'), marginBottom: v('space-2') }}>
                <Badge status="success">{t('Live', '公開中')}</Badge>
                <Badge status="info" subtle>
                  {t('New', '新着')}
                </Badge>
              </div>
              <h3 style={{ fontSize: v('text-lg'), fontWeight: v('weight-bold') }}>
                {t('Monthly report', '月次レポート')}
              </h3>
              <p style={{ color: v('color-fg-muted'), lineHeight: v('leading-ja') }}>
                {t(
                  "A summary of this month's activity. Look back on the team's results alongside the charts.",
                  '今月の活動をまとめました。グラフと一緒にチームの成果を振り返りましょう。',
                )}
              </p>
            </Card.Body>
            <Card.Footer>
              <Button variant="ghost" size="sm">
                {t('See details', '詳しく見る')}
              </Button>
            </Card.Footer>
          </Card>

          <Card>
            <Card.Body>
              <div style={{ display: 'flex', gap: v('space-2'), marginBottom: v('space-2') }}>
                <Badge status="warning">{t('Needs review', '要確認')}</Badge>
              </div>
              <h3 style={{ fontSize: v('text-lg'), fontWeight: v('weight-bold') }}>
                {t('Payment settings', 'お支払い設定')}
              </h3>
              <p style={{ color: v('color-fg-muted'), lineHeight: v('leading-ja') }}>
                {t(
                  "Your next charge is next week. Please check your card's expiry date.",
                  '次回の請求は来週です。カードの有効期限をご確認ください。',
                )}
              </p>
            </Card.Body>
            <Card.Footer>
              <Button status="warning" size="sm">
                {t('Review', '確認する')}
              </Button>
            </Card.Footer>
          </Card>
        </div>
      </div>
    );
  },
};

/** Color: surfaces, text, lead/accent, and state colors. */
export const Color: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ padding: v('space-8') }}>
        <Section
          title={t('Background and text', '背景とテキスト')}
          caption={t(
            'Background and text colors, set via --lily-color-bg-* and --lily-color-fg-*. Values swap between light and dark.',
            '背景とテキストの色です。--lily-color-bg-* と --lily-color-fg-* で指定します。値はライト/ダークで入れ替わります。',
          )}
        >
          <div style={grid()}>
            <Swatch token="color-bg-canvas" label="background" />
            <Swatch token="color-bg-surface" label="surface" />
            <Swatch token="color-bg-subtle" label="surface-subtle" />
            <Swatch token="color-bg-muted" label="surface-muted" />
            <Swatch token="color-fg-default" label="text" fg="color-bg-surface" />
            <Swatch token="color-fg-muted" label="text-secondary" fg="color-bg-surface" />
          </div>
        </Section>

        <Section
          title={t('Brand colors', 'ブランドカラー')}
          caption={t(
            'primary (--lily-color-primary) and accent (--lily-color-accent). Keep them in their own roles rather than mixing. primary is 笹百合 (sasayuri lily), accent the violet of 藤 (fuji wisteria), with hues kept clearly apart from the warm status colors (scarlet, amber). Every color name is a traditional Japanese color (和色). Values change between light and dark.',
            'primary（--lily-color-primary）と accent（--lily-color-accent）。混ぜず、役割を分けて使います。primary は笹百合（ささゆり）、accent は藤（ふじ）の菫色で、暖色の状態色（緋・琥珀）とは色相をはっきり分けています。色名はすべて日本の伝統色（和色）で統一しています。値はライト/ダークで変わります。',
          )}
        >
          <div style={grid()}>
            <Swatch token="color-primary" label="primary" fg="color-on-primary" />
            <Swatch token="color-primary-subtle" label="primary-subtle" fg="color-primary" />
            <Swatch token="color-accent" label="accent" fg="color-on-accent" />
            <Swatch token="color-accent-subtle" label="accent-subtle" fg="color-accent" />
          </div>
        </Section>

        <Section
          title={t('Status colors', '状態色')}
          caption={t(
            'Four colors — danger / warning / success / info. Use them only to signal state, never for decoration.',
            'danger / warning / success / info の 4 色。状態を示すときだけに使い、装飾には使いません。',
          )}
        >
          <div style={grid()}>
            <Swatch token="color-danger" label="danger" fg="color-on-danger" />
            <Swatch token="color-warning" label="warning" fg="color-on-warning" />
            <Swatch token="color-success" label="success" fg="color-on-success" />
            <Swatch token="color-info" label="info" fg="color-on-info" />
          </div>
        </Section>

        <Section
          title={t('Gradients', 'グラデーション')}
          caption={t(
            '--lily-color-primary-gradient and --lily-color-accent-gradient. Overusing them dilutes the effect, so aim for at most one spot per screen.',
            '--lily-color-primary-gradient と --lily-color-accent-gradient。多用すると効果が薄れるので、1 画面に 1 か所までを目安にするのがおすすめです。',
          )}
        >
          <div style={grid('16rem')}>
            {(['color-primary-gradient', 'color-accent-gradient'] as const).map((g) => (
              <div
                key={g}
                style={{
                  background: v(g),
                  color: v('color-on-accent'),
                  borderRadius: v('radius-xl'),
                  padding: v('space-6'),
                  minHeight: '6rem',
                  display: 'flex',
                  alignItems: 'flex-end',
                  fontWeight: v('weight-bold'),
                  boxShadow: v('shadow-md'),
                }}
              >
                --lily-{g}
              </div>
            ))}
          </div>
        </Section>
      </div>
    );
  },
};

/** Shape: radii and shadows. */
export const Shape: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
    <div style={{ padding: v('space-8') }}>
      <Section
        title={t('Radii', '角丸')}
        caption={t(
          '--lily-radius-{sm,md,lg,xl,2xl,pill}. Sai leans slightly larger.',
          '--lily-radius-{sm,md,lg,xl,2xl,pill}。彩では少し大きめにとっています。',
        )}
      >
        <div
          style={{ display: 'flex', gap: v('space-4'), flexWrap: 'wrap', alignItems: 'flex-end' }}
        >
          {(['sm', 'md', 'lg', 'xl', '2xl', 'pill'] as const).map((r) => (
            <div key={r} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '5rem',
                  height: '5rem',
                  background: v('color-primary-subtle'),
                  border: `1px solid ${v('color-border-default')}`,
                  borderRadius: v(`radius-${r}`),
                  marginBottom: v('space-2'),
                }}
              />
              <code style={{ fontSize: v('text-xs'), color: v('color-fg-muted') }}>{r}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={t('Shadows', '影')}
        caption={t(
          '--lily-shadow-{sm,md,lg,xl}. The default is md; use lg / xl only for stacked elements like modals.',
          '--lily-shadow-{sm,md,lg,xl}。既定は md、重なる要素（モーダル等）だけ lg / xl を使います。',
        )}
      >
        <div style={grid('12rem')}>
          {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
            <div
              key={s}
              style={{
                background: v('color-bg-surface'),
                borderRadius: v('radius-lg'),
                boxShadow: v(`shadow-${s}`),
                padding: v('space-6'),
                textAlign: 'center',
                fontWeight: v('weight-bold'),
              }}
            >
              shadow-{s}
            </div>
          ))}
        </div>
      </Section>
    </div>
    );
  },
};

/** Typography: Japanese-first leading, weights, and the type scale. */
export const Typography: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
    <div style={{ padding: v('space-8'), maxWidth: '48rem' }}>
      <Section
        title={t('Type scale', '文字サイズ')}
        caption={t(
          "Built in rem, so it follows the browser's font-size setting directly.",
          'rem で組んでいるので、ブラウザの文字サイズ設定にそのまま追従します。',
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: v('space-2') }}>
          {(['5xl', '3xl', '2xl', 'lg', 'md', 'sm'] as const).map((t) => (
            <div key={t} style={{ display: 'flex', gap: v('space-4'), alignItems: 'baseline' }}>
              <code
                style={{
                  fontSize: v('text-xs'),
                  color: v('color-fg-muted'),
                  width: '3rem',
                  flexShrink: 0,
                }}
              >
                {t}
              </code>
              <span style={{ fontSize: v(`text-${t}`), fontWeight: v('weight-bold') }}>
                {'見出しと本文　Heading'}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={t('Japanese line height', '和文の行間')}
        caption={t(
          'Body text uses --lily-leading-relaxed (1.7); long passages use --lily-leading-ja (1.85).',
          '本文は --lily-leading-relaxed（1.7）、長文は --lily-leading-ja（1.85）。',
        )}
      >
        <div style={{ display: 'grid', gap: v('space-4'), gridTemplateColumns: '1fr 1fr' }}>
          {(['normal', 'relaxed', 'ja'] as const).map((l) => (
            <div
              key={l}
              style={{
                border: `1px solid ${v('color-border-default')}`,
                borderRadius: v('radius-lg'),
                padding: v('space-4'),
              }}
            >
              <code style={{ fontSize: v('text-xs'), color: v('color-fg-muted') }}>
                leading-{l}
              </code>
              <p style={{ lineHeight: v(`leading-${l}`), marginTop: v('space-2') }}>
                {t(
                  'The same passage reads quite differently as the line height changes. Because Japanese alternates kana and kanji, a little more room between lines makes it easier to follow with the eye. A slow, almost read-aloud spacing feels about right.',
                  '同じ文章でも、行間が変わると読み心地はずいぶん変わります。日本語はひらがなと漢字が交互に並ぶぶん、行と行のあいだに少し余裕があるほうが目で追いやすくなります。声に出して読むくらいのゆっくりした間隔が、ちょうどよく感じられます。',
                )}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
    );
  },
};

/** Density: the same components, comfortable vs compact. */
export const Density: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
    <div style={{ padding: v('space-8') }}>
      <Section
        title={t('Density', '密度の切り替え')}
        caption={t(
          'Switch between comfortable (default) and compact via data-density. Compact shrinks control height for dashboards.',
          'data-density で comfortable（既定）と compact を切り替えます。compact は管理画面向けにコントロール高を縮めます。',
        )}
      >
        <div style={{ display: 'grid', gap: v('space-6'), gridTemplateColumns: '1fr 1fr' }}>
          {(['comfortable', 'compact'] as const).map((d) => (
            <div
              key={d}
              data-density={d}
              style={{
                border: `1px solid ${v('color-border-default')}`,
                borderRadius: v('radius-lg'),
                padding: v('space-6'),
                background: v('color-bg-surface'),
              }}
            >
              <code style={{ fontSize: v('text-xs'), color: v('color-fg-muted') }}>
                data-density=&quot;{d}&quot;
              </code>
              <div
                style={{
                  display: 'flex',
                  gap: v('space-3'),
                  marginTop: v('space-4'),
                  flexWrap: 'wrap',
                }}
              >
                <Button status="primary">{t('Save', '保存')}</Button>
                <Button variant="outline">{t('Cancel', 'キャンセル')}</Button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
    );
  },
};
