// "Foundations" — the style-only parts of the design system that aren't
// components: colour tokens, motion (animations + effects), and the spacing /
// radius / shadow / type scales. These get their own catalog section and pages.

import type { Locale } from '../i18n/ui';

export interface Foundation {
  id: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
}

export const foundations: Foundation[] = [
  {
    id: 'design-language',
    title: { ja: '彩（デザイン言語）', en: 'Design language (Sai)' },
    summary: {
      ja: 'Lily UI の色や形の決め方をまとめたページ。やわらかさ、あたたかさ、親しみやすさを大切にしていて、色の名前はすべて日本の伝統色（和色）でそろえています。',
      en: 'The thinking behind Lily UI’s color and shape: soft, warm, and approachable. Each color takes the name of a traditional Japanese color (和色).',
    },
  },
  {
    id: 'colors',
    title: { ja: 'カラー', en: 'Colors' },
    summary: {
      ja: '色に役割ごとの名前を付けて使い回すための仕組み（こうした名前付きの値をトークンと呼びます）。カラーコードを直接書く代わりに、primary・状態色・地・文字といった意味で色を指定します。ライトとダークのモードでは、同じ名前のまま色が切り替わります。',
      en: 'Color tokens named by their role. You pick colors by meaning (primary, status, surface, text), and the values swap between light and dark.',
    },
  },
  {
    id: 'palette',
    title: { ja: 'パレット', en: 'Palette' },
    summary: {
      ja: 'カラートークンの素になっている、色相ごとの明るさ違い（50〜900）の一覧。',
      en: 'The raw color ramps behind the tokens. Each hue runs from 50 (lightest) to 900 (darkest).',
    },
  },
  {
    id: 'motion',
    title: { ja: 'モーション', en: 'Motion' },
    summary: {
      ja: '要素の登場や退場、注目を引くためのアニメーションと、カーソルを重ねたときの反応や背景の装飾効果をまとめたもの。指定するだけで使えて、利用者が「画面の動きを減らす」設定にしているときは自動で止まります。',
      en: 'Entrance, exit, and attention animations, plus decorative hover and background effects. Add a class to use them; they stop under reduced-motion.',
    },
  },
  {
    id: 'tokens',
    title: { ja: 'スケール', en: 'Scales' },
    summary: {
      ja: '余白・角丸・影・文字サイズに、あらかじめ用意した段階的な値。たとえば余白は 4px 刻みで統一していて、数値を直接書く代わりに名前で指定します。これで画面全体の間隔や大きさが自然にそろいます。',
      en: 'Spacing, radius, shadow, and type-size tokens. Lay things out on the 4px grid by name, so raw numbers stay out of your code.',
    },
  },
];

export function getFoundation(id: string): Foundation | undefined {
  return foundations.find((f) => f.id === id);
}
