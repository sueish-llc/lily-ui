// UI chrome strings (navigation, headings, buttons). Component prose lives in
// the registry; this is just the shell. Keep Japanese natural — it is the
// primary language of this project.

export type Locale = 'ja' | 'en';
export const LOCALES: Locale[] = ['ja', 'en'];
export const DEFAULT_LOCALE: Locale = 'ja';

export const LOCALE_LABEL: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
};

type Dict = Record<string, string>;

const ja: Dict = {
  'site.name': 'Lily UI',
  'site.tagline': 'トークンで彩る、アクセシブルなデザインシステム',
  'site.description':
    'React・Vue・Web Components のどれでも同じ見た目と操作感になる、WCAG 2.1 AAA 準拠のデザインシステムです。',

  'nav.components': 'コンポーネント',
  'nav.foundations': '基礎',
  'nav.home': 'ホーム',
  'nav.storybook': 'Storybook',
  'nav.github': 'GitHub',

  'fnd.colors.brand': 'ブランド',
  'fnd.colors.status': '状態色',
  'fnd.colors.surface': '地',
  'fnd.colors.text': '文字',
  'fnd.colors.gradient': 'グラデーション',
  'fnd.tokens.spacing': '余白',
  'fnd.tokens.radius': '角丸',
  'fnd.tokens.shadow': '影',
  'fnd.tokens.type': '文字サイズ',
  'fnd.motion.entrance': '登場',
  'fnd.motion.exit': '退場',
  'fnd.motion.attention': '注目',
  'fnd.motion.hover': 'ホバー',
  'fnd.motion.text': '文字の装飾',
  'fnd.motion.background': '背景',
  'fnd.motion.ambient': '常時',
  'fnd.motion.replayAll': 'まとめて再生',
  'fnd.motion.hoverHint': 'カーソルを重ねてみてください',
  'fnd.motion.play': 'クリックまたはホバーで再生',
  'fnd.copyHint': 'クリックでコピー',
  'fnd.sai.principles': '原則',
  'fnd.sai.soft': 'やわらかさは、大きめの角丸、広くぼかした影、控えめな動きで出します。',
  'fnd.sai.warm': 'あたたかさは、笹百合（ささゆり）を主役の色に、藤（ふじ）の菫色を差し色にして添えます。',
  'fnd.sai.friendly': '親しみやすさは、色の役割を固定し、日本語をゆったり組むことで生まれます。',
  'fnd.sai.colors': '色の名前は和色で',
  'fnd.sai.colorsBody':
    '役割ごとに日本の伝統色（和色）を当てています。主役は花の和色、状態を表す色には緋・琥珀・緑・藍を使い、名前を見ればその色の役割が分かるようにしています。',
  'nav.skipToContent': '本文へスキップ',
  'nav.menu': 'メニュー',
  'nav.search': 'コンポーネントを検索',
  'nav.searchEmpty': '一致するコンポーネントがありません',

  'theme.toggle': 'テーマを切り替える',
  'theme.light': 'ライト',
  'theme.dark': 'ダーク',
  'theme.system': 'システム',

  'lang.switch': '言語',

  'home.hero.eyebrow': 'デザインシステム',
  'home.hero.cta.components': 'コンポーネントを見る',
  'home.hero.cta.github': 'GitHub で見る',
  'home.frameworks.title': '3 つのフレームワークで、同じ部品を',
  'home.frameworks.body':
    'React・Vue・Web Components のどれを選んでも、画面に表示される結果も、キーボードでの操作感も同じです。チームやページごとに、使い慣れたものを選べます。',
  'home.principles.title': '設計の指針',
  'home.principles.a11y.title': 'だれにとっても使いやすく',
  'home.principles.a11y.body':
    '文字は背景との差をしっかり取って読みやすく、操作はキーボードだけでも完結します。いま操作している場所も常に見え、動きは控えめです。見やすさの国際基準 WCAG の最高ランク AAA に合わせています。',
  'home.principles.tokens.title': 'デザイントークン',
  'home.principles.tokens.body':
    '色・余白・角丸・影は、あらかじめ名前を付けた値（トークン）で指定します。数値やカラーコードを毎回直接書くことはありません。',
  'home.principles.theming.title': 'テーマ（ライト・ダーク）',
  'home.principles.theming.body':
    '同じ名前の値にライトとダーク両方の色を用意してあるので、どの部品もどちらのモードでもきれいに表示されます。',
  'home.principles.ai.title': 'AI Ready',
  'home.principles.ai.body':
    '部品の名前や設定項目、ファイルの並べ方をそろえてあるので、決まりに沿うだけで正しいコードを書けます。AI にコードを書かせるときも迷いません。',
  'home.catalog.title': 'コンポーネント一覧',

  'comp.summary': '概要',
  'comp.playground': 'プレイグラウンド',
  'comp.preview': 'プレビュー',
  'comp.code': 'コード',
  'comp.props': '設定できる項目',
  'comp.examples': '使用例',
  'comp.a11y': 'アクセシビリティ',
  'comp.controls': 'その場で試す',
  'comp.copy': 'コピー',
  'comp.copied': 'コピーしました',
  'comp.noPreview': 'このコンポーネントは、画面上で動かして試せる表示にまだ対応していません。下のコードをご覧ください。',
  'comp.install': 'インストール',
  'comp.import': '読み込み',
  'comp.category': 'カテゴリ',
  'comp.relatedFrameworks': '対応フレームワーク',
  'comp.viewInStorybook': 'Storybook で見る',

  'prop.name': '名前',
  'prop.type': '型',
  'prop.default': '既定値',
  'prop.description': '説明',
  'prop.required': '必須',

  'a11y.contrast': '文字と背景の明るさの差をしっかり取り、読みやすくしています。ライトでもダークでも、見やすさの国際基準 WCAG の最高ランク AAA（明るさの差が 7:1 以上）を満たします。',
  'a11y.keyboard': 'マウスがなくても、キーボードだけですべての操作ができます。',
  'a11y.focus': 'いまどこを操作しているかを示す枠（フォーカスの囲み）が、常にはっきり見えます。',
  'a11y.motion': '利用者が「画面の動きを減らす」設定にしているときは、過剰なアニメーションを止めます。',
  'a11y.note': 'どのコンポーネントも、だれにとっても使いやすいように、見やすさの国際基準 WCAG の最高ランク AAA（WCAG 2.1 AAA）を満たすよう作っています。',

  'footer.builtWith': 'このサイト自体、Lily UI のトークンで作っています。',
  'footer.license': 'MIT License',

  'misc.translationPending': '日本語の説明は準備中です。いまは英語を表示しています。',
};

const en: Dict = {
  'site.name': 'Lily UI',
  'site.tagline': 'An accessible design system, colored by tokens',
  'site.description':
    'A WCAG 2.1 AAA design system that renders identically across React, Vue, and Web Components.',

  'nav.components': 'Components',
  'nav.foundations': 'Foundations',
  'nav.home': 'Home',
  'nav.storybook': 'Storybook',
  'nav.github': 'GitHub',

  'fnd.colors.brand': 'Brand',
  'fnd.colors.status': 'Status',
  'fnd.colors.surface': 'Surfaces',
  'fnd.colors.text': 'Text',
  'fnd.colors.gradient': 'Gradients',
  'fnd.tokens.spacing': 'Spacing',
  'fnd.tokens.radius': 'Radius',
  'fnd.tokens.shadow': 'Shadow',
  'fnd.tokens.type': 'Type scale',
  'fnd.motion.entrance': 'Entrance',
  'fnd.motion.exit': 'Exit',
  'fnd.motion.attention': 'Attention',
  'fnd.motion.hover': 'Hover',
  'fnd.motion.text': 'Text',
  'fnd.motion.background': 'Background',
  'fnd.motion.ambient': 'Ambient',
  'fnd.motion.replayAll': 'Replay all',
  'fnd.motion.hoverHint': 'Hover to preview',
  'fnd.motion.play': 'Click or hover to play',
  'fnd.copyHint': 'Click to copy',
  'fnd.sai.principles': 'Principles',
  'fnd.sai.soft': 'Softness comes from larger corner radii, wide soft shadows, and restrained motion.',
  'fnd.sai.warm': 'Warmth leads with the sasayuri lily and adds fuji-wisteria violet as the accent.',
  'fnd.sai.friendly':
    'Approachability comes from fixed color roles and Japanese set with room to breathe.',
  'fnd.sai.colors': 'Named after traditional Japanese colors',
  'fnd.sai.colorsBody':
    'Each role takes the name of a traditional Japanese color (和色): flower colors lead, with scarlet, amber, green, and indigo for status. The name tells you the role.',
  'nav.skipToContent': 'Skip to content',
  'nav.menu': 'Menu',
  'nav.search': 'Search components',
  'nav.searchEmpty': 'No matching components',

  'theme.toggle': 'Toggle theme',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.system': 'System',

  'lang.switch': 'Language',

  'home.hero.eyebrow': 'Design system',
  'home.hero.cta.components': 'Browse components',
  'home.hero.cta.github': 'View on GitHub',
  'home.frameworks.title': 'One component set, three frameworks',
  'home.frameworks.body':
    'Whether you pick React, Vue, or Web Components, the rendered HTML, class names, and keyboard behavior are identical. Choose per team or per page.',
  'home.principles.title': 'Design principles',
  'home.principles.a11y.title': 'WCAG 2.1 AAA',
  'home.principles.a11y.body':
    '7:1 body contrast, full keyboard support, visible focus, reduced motion. We target AAA, not AA.',
  'home.principles.tokens.title': 'Token-driven',
  'home.principles.tokens.body':
    'Color, spacing, radius, and shadow are all named tokens — never raw values or hex codes.',
  'home.principles.theming.title': 'Light / dark',
  'home.principles.theming.body':
    'The same token names carry both light and dark values, so every component holds up in either mode.',
  'home.principles.ai.title': 'AI-friendly',
  'home.principles.ai.body':
    'Uniform prop names, class names, and file layout let an agent infer correct code from convention.',
  'home.catalog.title': 'Component catalog',

  'comp.summary': 'Overview',
  'comp.playground': 'Playground',
  'comp.preview': 'Preview',
  'comp.code': 'Code',
  'comp.props': 'Props',
  'comp.examples': 'Examples',
  'comp.a11y': 'Accessibility',
  'comp.controls': 'Controls',
  'comp.copy': 'Copy',
  'comp.copied': 'Copied',
  'comp.noPreview': 'This component has no live preview yet — see the code below.',
  'comp.install': 'Install',
  'comp.import': 'Import',
  'comp.category': 'Category',
  'comp.relatedFrameworks': 'Available in',
  'comp.viewInStorybook': 'View in Storybook',

  'prop.name': 'Name',
  'prop.type': 'Type',
  'prop.default': 'Default',
  'prop.description': 'Description',
  'prop.required': 'required',

  'a11y.contrast': 'Body/background contrast is ≥ 7:1 (AAA) in both light and dark.',
  'a11y.keyboard': 'Every interaction works with the keyboard alone.',
  'a11y.focus': 'The focus ring is always visible.',
  'a11y.motion': 'Respects prefers-reduced-motion and stops excessive motion.',
  'a11y.note': 'Every component is designed to meet WCAG 2.1 AAA.',

  'footer.builtWith': 'This site itself is built with Lily UI tokens.',
  'footer.license': 'MIT License',

  'misc.translationPending': 'Japanese copy is in progress (showing English).',
};

const DICTS: Record<Locale, Dict> = { ja, en };

export function useTranslations(locale: Locale) {
  const dict = DICTS[locale] ?? ja;
  return function t(key: string): string {
    return dict[key] ?? DICTS.en[key] ?? key;
  };
}
