import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { makeT, type StoryLocale } from '../storybook/i18n';

// =============================================================================
// Color Palette — every primitive ramp, laid out step-by-step.
// -----------------------------------------------------------------------------
// Primitive ramps are intentionally NOT emitted as CSS custom properties (only
// the semantic `--lily-color-*` tokens are — see docs/tokens.md), so this
// catalog mirrors the literal values in
// packages/css/src/styles/tokens/_primitives.scss ($palette). Keep them in sync.
// =============================================================================

type Ramp = Record<string, string>;

const PALETTE: Record<string, Ramp> = {
  brand: { 50: '#fdf1f8', 100: '#fbd9ed', 200: '#f6b6db', 300: '#ef88c1', 400: '#e6549f', 500: '#d22879', 600: '#ad2167', 700: '#871d5e', 800: '#631444', 900: '#42102c' },
  neutral: { 0: '#ffffff', 50: '#faf9f7', 100: '#f2f0ec', 200: '#e6e2db', 300: '#d3cdc4', 400: '#a49d92', 500: '#756e64', 600: '#534d45', 700: '#38332d', 800: '#221e1a', 900: '#14110e', 950: '#0b0908' },
  fuji: { 50: '#f6f1fb', 100: '#e9ddf7', 200: '#d3bbef', 300: '#ba94e4', 400: '#9c66d6', 500: '#8442c6', 600: '#6e2fab', 700: '#561f86', 800: '#3d1560' },
  sakura: { 50: '#fff0f4', 100: '#ffdbe5', 200: '#ffbace', 300: '#ff8fad', 400: '#fb6690', 500: '#ee4d7a', 600: '#cf3a64', 700: '#a02b4d' },
  red: { 50: '#fcecea', 100: '#f8c8c3', 200: '#f08c84', 300: '#ec7567', 500: '#d63828', 600: '#b52e20', 700: '#8c2417', 800: '#6d1c12' },
  amber: { 50: '#fef6e7', 100: '#fce4ba', 300: '#f5c25e', 500: '#e89c0c', 600: '#c5840a', 700: '#936207', 800: '#6f4a05' },
  green: { 50: '#ecf6ec', 100: '#cde8cf', 300: '#5fc379', 500: '#2f7a43', 600: '#276739', 700: '#1d4e2b', 800: '#163a20' },
  blue: { 50: '#eef0f9', 100: '#d3d9f0', 300: '#8ea2db', 500: '#41549f', 600: '#36457f', 700: '#2a3760' },
};

/**
 * Role + the traditional Japanese color (和色) each ramp is named for. Labels
 * stay short and consistent: `role · 和色`.
 */
const ROLE: Record<string, [en: string, ja: string]> = {
  brand: ['primary · lily', 'primary · 笹百合'],
  neutral: ['neutral · warm gray', 'neutral · 背景と文字'],
  fuji: ['accent · wisteria', 'accent · 藤'],
  sakura: ['accent gradient only · cherry', 'accent グラデ専用 · 桜'],
  red: ['danger · scarlet', 'danger · 緋'],
  amber: ['warning · amber', 'warning · 琥珀'],
  green: ['success · green', 'success · 緑'],
  blue: ['info · indigo', 'info · 藍'],
};

/** Relative luminance → pick a legible text color for the step number on a swatch. */
function readableOn(hex: string): string {
  const n = hex.replace('#', '');
  const full = n.length === 3 ? n.split('').map((c) => c + c).join('') : n;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r!) + 0.7152 * lin(g!) + 0.0722 * lin(b!);
  return L > 0.42 ? '#14110e' : '#ffffff';
}

function Ramp({ name, steps, locale }: { name: string; steps: Ramp; locale: StoryLocale }) {
  const role = ROLE[name] ?? [name, name];
  const label = makeT(locale)(role[0], role[1]);
  const entries = Object.entries(steps);
  return (
    <div style={{ marginBottom: 'var(--lily-space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--lily-space-2)', marginBottom: 'var(--lily-space-1)' }}>
        <strong style={{ fontSize: 'var(--lily-text-md)', textTransform: 'capitalize' }}>{name}</strong>
        <span style={{ color: 'var(--lily-color-fg-muted)', fontSize: 'var(--lily-text-sm)' }}>· {label}</span>
      </div>
      {/* Color band: contiguous swatches with the step number inside. */}
      <div style={{ display: 'flex', borderRadius: 'var(--lily-radius-md)', overflow: 'hidden', boxShadow: 'var(--lily-shadow-sm)' }}>
        {entries.map(([step, hex]) => (
          <div
            key={step}
            title={`${name}-${step} ${hex}`}
            style={{
              flex: 1,
              minWidth: 0,
              height: 'var(--lily-control-h-lg)',
              background: hex,
              color: readableOn(hex),
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 4,
              fontSize: 'var(--lily-text-xs)',
              fontWeight: 'var(--lily-weight-bold)',
            }}
          >
            {step}
          </div>
        ))}
      </div>
      {/* Hex row beneath, one column per swatch (truncates rather than overlaps). */}
      <div style={{ display: 'flex' }}>
        {entries.map(([step, hex]) => (
          <div
            key={step}
            style={{
              flex: 1,
              minWidth: 0,
              padding: '4px 2px 0',
              fontSize: 10,
              lineHeight: 1.2,
              color: 'var(--lily-color-fg-muted)',
              textAlign: 'center',
              fontVariantNumeric: 'tabular-nums',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {hex}
          </div>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Foundations/Color Palette',
  parameters: {
    docs: { description: { component: 'The raw primitive color ramps (50–900). Components consume the semantic --lily-color-* tokens built from these.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Ramps: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ maxWidth: 920 } as CSSProperties}>
        <p style={{ color: 'var(--lily-color-fg-muted)', marginTop: 0, marginBottom: 'var(--lily-space-5)', maxWidth: '60ch' }}>
          {t(
            'Every ramp is a traditional Japanese color (和色). Hues sit far apart on the wheel — scarlet 6° · amber 39° · green 136° · indigo 228° · wisteria 270° · lily 331° — so each role stays distinguishable. Components use the semantic --lily-color-* tokens, not these steps directly.',
            'すべて日本の伝統色（和色）です。色相は環状に大きく離して配置（緋 6°・琥珀 39°・緑 136°・藍 228°・藤 270°・笹百合 331°）し、役割どうしが必ず判別できるようにしています。コンポーネントはここから生成されるセマンティックトークン（--lily-color-*）を参照します。',
          )}
        </p>
        {Object.entries(PALETTE).map(([name, steps]) => (
          <Ramp key={name} name={name} steps={steps} locale={globals.locale as StoryLocale} />
        ))}
      </div>
    );
  },
};
