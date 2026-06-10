import type { Meta, StoryObj } from '@storybook/react';
import { type CSSProperties, type ReactNode } from 'react';
import {
  AMBIENT_EFFECTS,
  BACKGROUND_EFFECTS,
  HOVER_EFFECTS,
  TEXT_EFFECTS,
} from '../motion/effects';
import { makeT, type StoryLocale } from '../storybook/i18n';

// =============================================================================
// 効果のカタログ。置いておくと動き続ける飾りや、ホバーで反応する飾りを並べる。
// -----------------------------------------------------------------------------
// `.lily-fx--*` を一覧にしている。動きの強さ（Full / Minimal / None）は
// ツールバーの Motion で切り替える。Minimal では常時動くものが止まる。
// =============================================================================

const v = (name: string) => `var(--lily-${name})`;

const grid: CSSProperties = {
  display: 'grid',
  gap: v('space-4'),
  gridTemplateColumns: 'repeat(auto-fill, minmax(11rem, 1fr))',
};

const box: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  minHeight: '5.5rem',
  padding: v('space-4'),
  borderRadius: v('radius-lg'),
  border: `1px solid ${v('color-border-default')}`,
  background: v('color-bg-surface'),
  color: v('color-fg-default'),
};

function Tile({ name, children }: { name: string; children: ReactNode }) {
  return (
    <figure style={{ margin: 0, display: 'grid', gap: v('space-2'), justifyItems: 'center' }}>
      {children}
      <figcaption>
        <code style={{ fontSize: v('text-xs') }}>{name}</code>
      </figcaption>
    </figure>
  );
}

function Section({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: v('space-10') }}>
      <h2 style={{ fontSize: v('text-2xl'), fontWeight: v('weight-bold'), margin: 0 }}>{title}</h2>
      <p style={{ color: v('color-fg-muted'), margin: `${v('space-1')} 0 ${v('space-4')}` }}>{lead}</p>
      <div style={grid}>{children}</div>
    </section>
  );
}

const meta = {
  title: 'Foundations/Effects',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '`.lily-fx` に効果の名前のクラス（`lily-fx--gradient-text` など）を足すと、文字・枠・背景に飾りの動きをつけられます。効果は重ねられます。動きの強さはツールバーの Motion で変えられます。',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Catalog: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ padding: v('space-6'), maxWidth: '72rem', margin: '0 auto' }}>
        <p
          style={{
            color: v('color-fg-muted'),
            marginBottom: v('space-8'),
            maxWidth: '60ch',
            lineHeight: v('leading-relaxed'),
          }}
        >
          {t(
            'A set of decorations: some keep moving on their own, others react to the cursor. Set Motion to Minimal in the toolbar to stop the always-on ones, or None to stop them all.',
            '置いておくと動き続ける飾りや、カーソルを重ねると反応する飾りを集めました。ツールバーの Motion を Minimal にすると常に動くものは止まり、None にするとすべて止まります。',
          )}
        </p>

        <Section
          title={t('Text decoration', '文字の飾り')}
          lead={t(
            'Best for large text like headings and logos. For body text, add `safe` alongside `gradient-text` to keep 7:1 contrast on any background.',
            '見出しやロゴなど、大きな文字に向いています。本文で gradient-text を使うときは safe を併せて指定すると、どの下地でも 7:1 を保ちます。',
          )}
        >
          {TEXT_EFFECTS.map((name) => (
            <Tile key={name} name={name}>
              <span
                className={`lily-fx lily-fx--${name}`}
                style={{ fontSize: v('text-4xl'), fontWeight: v('weight-extrabold') }}
              >
                彩 Lily
              </span>
            </Tile>
          ))}
          <Tile name="gradient-text + safe">
            <span
              className="lily-fx lily-fx--gradient-text lily-fx--safe"
              style={{ fontSize: v('text-md'), fontWeight: v('weight-bold') }}
            >
              {t('Readable at body size, with a gentle shimmer.', '本文サイズでも読みやすく、ほんのり流れます。')}
            </span>
          </Tile>
        </Section>

        <Section
          title={t('Hover decoration', '重ねると反応する飾り')}
          lead={t('React when you hover over them.', 'カーソルを重ねると反応します。')}
        >
          {HOVER_EFFECTS.map((name) => (
            <Tile key={name} name={name}>
              <div className={`lily-fx lily-fx--${name}`} style={box}>
                {t('Hover here', '重ねてみてください')}
              </div>
            </Tile>
          ))}
        </Section>

        <Section
          title={t('Ambient decoration', '動き続ける飾り')}
          lead={t('Keep moving on their own.', '置いておくと動き続けます。')}
        >
          {AMBIENT_EFFECTS.map((name) => (
            <Tile key={name} name={name}>
              <div className={`lily-fx lily-fx--${name}`} style={box}>
                彩
              </div>
            </Tile>
          ))}
        </Section>

        <Section
          title={t('Background decoration', '背景に敷く飾り')}
          lead={t('Best behind page headers or as section dividers.', 'ページの見出し部分や区切りの背景に向いています。')}
        >
          {BACKGROUND_EFFECTS.map((name) => (
            <div
              key={name}
              className={`lily-fx lily-fx--${name}`}
              style={{
                gridColumn: '1 / -1',
                display: 'grid',
                placeItems: 'center',
                minHeight: '9rem',
                borderRadius: v('radius-xl'),
                color: v('color-fg-default'),
                overflow: 'hidden',
              }}
            >
              <code style={{ fontSize: v('text-sm') }}>{name}</code>
            </div>
          ))}
        </Section>
      </div>
    );
  },
};
