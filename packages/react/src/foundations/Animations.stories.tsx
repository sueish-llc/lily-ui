import type { Meta, StoryObj } from '@storybook/react';
import { type CSSProperties } from 'react';
import {
  ATTENTION_ANIMATIONS,
  ENTRANCE_ANIMATIONS,
  EXIT_ANIMATIONS,
  type AnimationName,
} from '../motion/animations';
import { useAnimate } from '../hooks/useAnimate';
import { makeT, type StoryLocale } from '../storybook/i18n';

// =============================================================================
// 動きのカタログ。カードを押すと、その動きを再生する。
// -----------------------------------------------------------------------------
// `.lily-animate--*` を一覧にしている。動きの強さ（Full / Minimal / None）は
// ツールバーの Motion で切り替える。
// =============================================================================

const v = (name: string) => `var(--lily-${name})`;

const grid: CSSProperties = {
  display: 'grid',
  gap: v('space-3'),
  gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
};

function Card({ name }: { name: AnimationName }) {
  const { ref, play } = useAnimate<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onClick={() => void play(name)}
      style={{
        padding: v('space-4'),
        borderRadius: v('radius-lg'),
        border: `1px solid ${v('color-border-default')}`,
        background: v('color-bg-surface'),
        color: v('color-fg-default'),
        cursor: 'pointer',
        boxShadow: v('shadow-sm'),
      }}
    >
      <code style={{ fontSize: v('text-xs') }}>{name}</code>
    </button>
  );
}

function Section({
  title,
  lead,
  names,
}: {
  title: string;
  lead: string;
  names: readonly AnimationName[];
}) {
  return (
    <section style={{ marginBottom: v('space-10') }}>
      <h2 style={{ fontSize: v('text-2xl'), fontWeight: v('weight-bold'), margin: 0 }}>{title}</h2>
      <p style={{ color: v('color-fg-muted'), margin: `${v('space-1')} 0 ${v('space-4')}` }}>{lead}</p>
      <div style={grid}>
        {names.map((n) => (
          <Card key={n} name={n} />
        ))}
      </div>
    </section>
  );
}

const meta = {
  title: 'Foundations/Animations',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'クラスを足すだけで、要素に動きをつけられます。`.lily-animate` に、動きの名前のクラス（`lily-animate--fade-in` など）を組み合わせます。動きの強さはツールバーの Motion で変えられます。',
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
            'Click a card to play its animation. Set Motion to Minimal in the toolbar for a gentler version, or None to turn it off — match the device or your preference.',
            'カードを押すと、その動きを再生します。ツールバーの Motion を Minimal にすると控えめな動きになり、None にすると止まります。端末の性能や好みに合わせて選べます。',
          )}
        </p>
        <Section
          title={t('Entrance', 'あらわれる動き')}
          lead={t('For elements appearing on screen.', '要素が出てくるときに使います。')}
          names={ENTRANCE_ANIMATIONS}
        />
        <Section
          title={t('Exit', '消える動き')}
          lead={t('For elements leaving the screen.', '要素が消えていくときに使います。')}
          names={EXIT_ANIMATIONS}
        />
        <Section
          title={t('Attention', '目を引く動き')}
          lead={t('For drawing the eye to something.', '見てほしいところに注目させたいときに使います。')}
          names={ATTENTION_ANIMATIONS}
        />
      </div>
    );
  },
};
