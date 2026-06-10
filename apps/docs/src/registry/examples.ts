// Declarative examples (one node tree per component). The Playground renders
// these and generates the matching React / Vue / Web Components code from the
// SAME tree, so the preview and the code never disagree. Keyed by the React
// component name (= the registry `name`).
//
// Components NOT listed here keep the interactive controls playground, where the
// generic single-element render already matches its generated code.

import type { ExampleNode } from '../lib/example';

const searchSvg: ExampleNode = {
  c: 'svg',
  p: { viewBox: '0 0 24 24', width: '1em', height: '1em', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 },
  k: [
    { c: 'circle', p: { cx: 11, cy: 11, r: 7 } },
    { c: 'path', p: { d: 'M21 21l-4.3-4.3', 'stroke-linecap': 'round' } },
  ],
};

// A tiny inline image so the preview needs no network.
const sampleImg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='320' height='180' fill='%23d22879'/%3E%3Ctext x='160' y='100' font-size='28' fill='white' text-anchor='middle' font-family='sans-serif'%3ELily%3C/text%3E%3C/svg%3E";

export const exampleNodes: Record<string, ExampleNode> = {
  // ── Data display ──────────────────────────────────────────────────────────
  Alert: {
    c: 'Alert',
    p: { status: 'success', title: '保存しました' },
    k: ['変更内容は保存されています。'],
  },
  Avatar: {
    c: 'Stack',
    p: { direction: 'horizontal', gap: '3' },
    k: [
      { c: 'Avatar', p: { name: 'Ada Lovelace' } },
      { c: 'Avatar', p: { name: 'Grace Hopper', status: 'success', statusLabel: 'online' } },
      { c: 'Avatar', p: { name: 'Lily UI' } },
    ],
  },
  Card: {
    c: 'Card',
    k: [
      { c: 'Card.Header', k: ['お知らせ'] },
      {
        c: 'Card.Body',
        k: [{ c: 'Card.Title', k: ['新しいバージョン'] }, 'トークンを見直し、ダークモードの表示を調整しました。'],
      },
      { c: 'Card.Footer', k: [{ c: 'Button', p: { size: 'sm' }, k: ['詳しく見る'] }] },
    ],
  },
  ListGroup: {
    c: 'ListGroup',
    k: [
      { c: 'ListGroup.Item', k: ['受信トレイ'] },
      { c: 'ListGroup.Item', k: ['送信済み'] },
      { c: 'ListGroup.Item', k: ['下書き'] },
    ],
  },
  Stat: {
    c: 'Stat',
    p: { label: '売上', value: '¥1.2M', delta: '+12%', trend: 'up', help: '前月比' },
  },
  Table: {
    c: 'Table',
    p: { caption: 'メンバー', striped: true },
    k: [
      { c: 'thead', k: [{ c: 'tr', k: [{ c: 'th', p: { scope: 'col' }, k: ['名前'] }, { c: 'th', p: { scope: 'col' }, k: ['役割'] }] }] },
      {
        c: 'tbody',
        k: [
          { c: 'tr', k: [{ c: 'td', k: ['Ada'] }, { c: 'td', k: ['管理者'] }] },
          { c: 'tr', k: [{ c: 'td', k: ['Grace'] }, { c: 'td', k: ['編集者'] }] },
        ],
      },
    ],
  },
  Timeline: {
    c: 'Timeline',
    p: {
      items: [
        { title: '注文を受け付けました', time: '10:00', status: 'success' },
        { title: '発送しました', time: '14:30', status: 'info' },
        { title: 'お届け予定', time: '明日', status: 'neutral' },
      ],
    },
  },

  // ── Disclosure / Navigation ───────────────────────────────────────────────
  Accordion: {
    c: 'Accordion',
    p: {
      items: [
        { id: 'a', header: '配送について', content: '注文の翌営業日に発送します。' },
        { id: 'b', header: '返品について', content: '到着後 30 日以内なら返品できます。' },
        { id: 'c', header: '支払い方法', content: 'クレジットカードと銀行振込に対応しています。' },
      ],
    },
  },
  Tabs: {
    c: 'Tabs',
    p: {
      label: '設定',
      items: [
        { id: 'general', label: '一般', content: '一般の設定です。' },
        { id: 'profile', label: 'プロフィール', content: 'プロフィールの設定です。' },
        { id: 'billing', label: '支払い', content: '支払いの設定です。' },
      ],
    },
  },
  Breadcrumb: {
    c: 'Breadcrumb',
    p: { items: [{ label: 'ホーム', href: '#' }, { label: 'ライブラリ', href: '#' }, { label: 'データ表示' }] },
  },
  Pagination: { c: 'Pagination', p: { count: 8, page: 2 } },
  Stepper: { c: 'Stepper', p: { active: 1, steps: [{ label: 'カート' }, { label: '配送' }, { label: '確認' }] } },
  Menu: {
    c: 'Menu',
    p: {
      'aria-label': '操作',
      items: [
        { label: '編集', value: 'edit' },
        { label: '複製', value: 'duplicate' },
        { divider: true },
        { label: '削除', value: 'delete' },
      ],
    },
  },
  Tree: {
    c: 'Tree',
    p: {
      'aria-label': 'ファイル',
      defaultExpanded: ['src'],
      nodes: [
        { id: 'src', label: 'src', children: [{ id: 'index', label: 'index.ts' }, { id: 'app', label: 'App.tsx' }] },
        { id: 'readme', label: 'README.md' },
      ],
    },
  },
  Navbar: {
    c: 'Navbar',
    p: { brand: 'Lily' },
    k: [{ c: 'Link', p: { href: '#' }, k: ['ドキュメント'] }, { c: 'Link', p: { href: '#' }, k: ['概要'] }],
  },

  // ── Overlay (self-managing trigger; no external state needed) ─────────────
  Dropdown: {
    c: 'Dropdown',
    p: { trigger: '操作' },
    k: [
      { c: 'Dropdown.Item', k: ['編集'] },
      { c: 'Dropdown.Item', k: ['複製'] },
      { c: 'Dropdown.Divider' },
      { c: 'Dropdown.Item', k: ['削除'] },
    ],
  },
  Popover: {
    c: 'Popover',
    p: { title: 'ヒント', content: '詳しい説明をここに表示します。' },
    k: [{ c: 'Button', p: { variant: 'outline' }, k: ['詳細'] }],
  },
  Tooltip: {
    c: 'Tooltip',
    p: { content: '削除' },
    k: [{ c: 'Button', p: { variant: 'ghost' }, k: ['🗑'] }],
  },

  // ── Forms ─────────────────────────────────────────────────────────────────
  FormField: {
    c: 'FormField',
    p: { label: 'メールアドレス', help: '他人には共有しません。', required: true },
    k: [{ c: 'Input', p: { type: 'email', placeholder: 'you@example.com' } }],
  },
  InputGroup: {
    c: 'InputGroup',
    k: [{ c: 'InputGroup.Addon', k: ['https://'] }, { c: 'Input', p: { placeholder: 'example.com' } }],
  },
  Select: {
    c: 'FormField',
    p: { label: '国' },
    k: [
      {
        c: 'Select',
        k: [
          { c: 'option', p: { value: 'jp' }, k: ['日本'] },
          { c: 'option', p: { value: 'us' }, k: ['アメリカ'] },
          { c: 'option', p: { value: 'fr' }, k: ['フランス'] },
        ],
      },
    ],
  },
  SegmentedControl: {
    c: 'SegmentedControl',
    p: {
      'aria-label': '表示',
      defaultValue: 'list',
      options: [
        { value: 'list', label: 'リスト' },
        { value: 'grid', label: 'グリッド' },
        { value: 'board', label: 'ボード' },
      ],
    },
  },
  Combobox: {
    c: 'Combobox',
    p: {
      'aria-label': '国',
      options: [
        { value: 'jp', label: '日本' },
        { value: 'us', label: 'アメリカ' },
        { value: 'fr', label: 'フランス' },
      ],
    },
  },
  Cascader: {
    c: 'Cascader',
    p: {
      'aria-label': '地域',
      options: [
        { value: 'kanto', label: '関東', children: [{ value: 'tokyo', label: '東京' }, { value: 'kanagawa', label: '神奈川' }] },
        { value: 'kansai', label: '関西', children: [{ value: 'osaka', label: '大阪' }, { value: 'kyoto', label: '京都' }] },
      ],
    },
  },
  Transfer: {
    c: 'Transfer',
    p: {
      titles: ['候補', '選択済み'],
      defaultValue: ['a'],
      items: [
        { value: 'a', label: 'りんご' },
        { value: 'b', label: 'みかん' },
        { value: 'c', label: 'ぶどう' },
        { value: 'd', label: 'もも' },
      ],
    },
  },
  FloatingLabel: {
    c: 'FloatingLabel',
    p: { label: 'メールアドレス' },
    k: [{ c: 'Input', p: { type: 'email', placeholder: ' ' } }],
  },
  NumberInput: { c: 'FormField', p: { label: '数量' }, k: [{ c: 'NumberInput', p: { min: 0, max: 99, defaultValue: 1 } }] },
  Textarea: { c: 'FormField', p: { label: '自己紹介' }, k: [{ c: 'Textarea', p: { rows: 3, defaultValue: 'はじめまして。' } }] },
  TagInput: { c: 'FormField', p: { label: '宛先' }, k: [{ c: 'TagInput', p: { defaultValue: ['ada@example.com'] } }] },
  Range: { c: 'FormField', p: { label: '音量' }, k: [{ c: 'Range', p: { min: 0, max: 100, defaultValue: 60 } }] },
  RangeDual: { c: 'RangeDual', p: { min: 0, max: 1000, step: 10, defaultValue: [200, 800] } },
  Checkbox: { c: 'Checkbox', p: { label: '利用規約に同意する', defaultChecked: true } },
  Switch: { c: 'Switch', p: { label: '通知を受け取る', defaultChecked: true } },
  Radio: {
    c: 'Stack',
    p: { gap: '2' },
    k: [
      { c: 'Radio', p: { name: 'plan', value: 'free', label: '無料', defaultChecked: true } },
      { c: 'Radio', p: { name: 'plan', value: 'pro', label: 'プロ' } },
    ],
  },

  // ── Feedback ──────────────────────────────────────────────────────────────
  Progress: { c: 'Progress', p: { value: 60, label: 'アップロード', showLabel: true } },
  Meter: { c: 'Meter', p: { label: 'ストレージ', value: 75, valueText: '100GB 中 75GB', status: 'warning', showValue: true } },
  Skeleton: {
    c: 'Stack',
    p: { gap: '2' },
    k: [
      { c: 'Skeleton', p: { variant: 'text' } },
      { c: 'Skeleton', p: { variant: 'text', width: '70%' } },
      { c: 'Skeleton', p: { variant: 'rect', height: 80 } },
    ],
  },
  EmptyState: {
    c: 'EmptyState',
    p: { title: 'まだ何もありません', description: '最初の項目を追加しましょう。' },
    k: [{ c: 'Button', k: ['追加する'] }],
  },

  // ── Actions / layout / misc ───────────────────────────────────────────────
  ButtonGroup: {
    c: 'ButtonGroup',
    p: { label: '文字ぞろえ' },
    k: [{ c: 'Button', k: ['左'] }, { c: 'Button', k: ['中央'] }, { c: 'Button', k: ['右'] }],
  },
  Stack: {
    c: 'Stack',
    p: { gap: '3' },
    k: [{ c: 'Button', k: ['1 つめ'] }, { c: 'Button', k: ['2 つめ'] }, { c: 'Button', k: ['3 つめ'] }],
  },
  Grid: {
    c: 'Row',
    p: { gutter: '3' },
    k: [
      { c: 'Col', p: { span: 12, md: 4 }, k: [{ c: 'Card', k: [{ c: 'Card.Body', k: ['A'] }] }] },
      { c: 'Col', p: { span: 12, md: 4 }, k: [{ c: 'Card', k: [{ c: 'Card.Body', k: ['B'] }] }] },
      { c: 'Col', p: { span: 12, md: 4 }, k: [{ c: 'Card', k: [{ c: 'Card.Body', k: ['C'] }] }] },
    ],
  },
  Container: { c: 'Container', k: ['中身は中央に寄り、最大幅がそろいます。'] },
  Divider: { c: 'Divider', p: { strong: true } },
  Ratio: {
    c: 'Ratio',
    p: { ratio: '16x9' },
    k: [{ c: 'Image', p: { src: sampleImg, alt: 'サンプル画像' } }],
  },
  ScrollArea: {
    c: 'ScrollArea',
    p: { maxHeight: 140 },
    k: [{ c: 'Stack', p: { gap: '2' }, k: Array.from({ length: 8 }, (_, i) => ({ c: 'Card', k: [{ c: 'Card.Body', k: [`項目 ${i + 1}`] }] })) }],
  },
  Splitter: {
    c: 'Splitter',
    p: { defaultSize: 35, start: 'サイド', end: '本文のエリア' },
  },
  Icon: { c: 'Icon', p: { size: 'lg', tone: 'primary', label: '検索' }, k: [searchSvg] },
  Image: { c: 'Image', p: { src: sampleImg, alt: 'サンプル画像', ratio: [16, 9], rounded: true } },
  Kbd: {
    c: 'Stack',
    p: { direction: 'horizontal', gap: '2' },
    k: [{ c: 'Kbd', k: ['⌘'] }, { c: 'Kbd', k: ['K'] }],
  },
  Link: { c: 'Link', p: { href: '#' }, k: ['ドキュメントを見る'] },
  Input: { c: 'FormField', p: { label: 'お名前' }, k: [{ c: 'Input', p: { placeholder: '山田 花子' } }] },
  Typography: {
    c: 'Stack',
    p: { gap: '2' },
    k: [
      { c: 'Heading', p: { level: 3 }, k: ['見出し'] },
      { c: 'Text', k: ['本文のテキストです。読みやすい行間で組まれます。'] },
      { c: 'Text', p: { variant: 'small', tone: 'muted' }, k: ['補足のテキスト。'] },
    ],
  },
  CopyButton: { c: 'CopyButton', p: { value: 'pnpm add @lily-ui/react', label: 'pnpm add @lily-ui/react' } },
  CloseButton: { c: 'CloseButton', p: { label: '閉じる' } },
  Spinner: { c: 'Spinner' },
  Rating: { c: 'Rating', p: { label: '評価', defaultValue: 3 } },
  ColorPicker: { c: 'ColorPicker', p: { 'aria-label': 'テーマ色', defaultValue: '#d22879' } },
  PinInput: { c: 'FormField', p: { label: '認証コード' }, k: [{ c: 'PinInput', p: { length: 6 } }] },
  DatePicker: { c: 'FormField', p: { label: '日付' }, k: [{ c: 'DatePicker' }] },
  DateRangePicker: { c: 'DateRangePicker' },
  TimePicker: { c: 'FormField', p: { label: '時刻' }, k: [{ c: 'TimePicker', p: { minuteStep: 15 } }] },
  Calendar: { c: 'Calendar' },
  FileUpload: { c: 'FileUpload', p: { accept: 'image/*' } },
  Affix: {
    c: 'Affix',
    p: { offset: 16 },
    k: [{ c: 'Badge', p: { status: 'info' }, k: ['スクロールで上部に追従'] }],
  },

  // ── New components (static examples) ──────────────────────────────────────
  CodeBlock: {
    c: 'CodeBlock',
    p: { language: 'bash' },
    k: ['pnpm add @lily-ui/react'],
  },
  Descriptions: {
    c: 'Descriptions',
    p: { columns: 1, bordered: true },
    k: [
      { c: 'DescriptionsItem', p: { term: 'バージョン' }, k: ['1.0.0'] },
      { c: 'DescriptionsItem', p: { term: 'ライセンス' }, k: ['MIT'] },
      { c: 'DescriptionsItem', p: { term: '対応環境' }, k: ['Node 26 / モダンブラウザ'] },
    ],
  },
  Mark: {
    c: 'Text',
    k: ['続行する前に', { c: 'Mark', k: ['重要なお知らせ'] }, 'をご確認ください。'],
  },
  Result: {
    c: 'Result',
    p: {
      status: 'success',
      title: '送信が完了しました',
      description: 'お問い合わせを受け付けました。担当者からの返信をお待ちください。',
    },
    k: [{ c: 'Button', p: { status: 'primary' }, k: ['ホームに戻る'] }],
  },
  Toolbar: {
    c: 'Toolbar',
    p: { 'aria-label': '文字の書式' },
    k: [
      { c: 'Button', p: { variant: 'ghost', size: 'sm' }, k: ['太字'] },
      { c: 'Button', p: { variant: 'ghost', size: 'sm' }, k: ['斜体'] },
      { c: 'Button', p: { variant: 'ghost', size: 'sm' }, k: ['下線'] },
    ],
  },
  Fieldset: {
    c: 'Fieldset',
    p: { legend: '配送先', description: '商品をお届けする住所を入力してください。' },
    k: [
      { c: 'FormField', p: { label: '住所' }, k: [{ c: 'Input', p: { placeholder: '東京都千代田区…' } }] },
      { c: 'FormField', p: { label: '電話番号' }, k: [{ c: 'Input', p: { type: 'tel', placeholder: '03-0000-0000' } }] },
    ],
  },
  Watermark: {
    c: 'Watermark',
    p: { text: '社外秘' },
    k: [
      {
        c: 'Card',
        k: [
          {
            c: 'Card.Body',
            k: ['この資料には社外秘の情報が含まれます。背面に透かしが繰り返し表示されます。'],
          },
        ],
      },
    ],
  },
  TreeSelect: {
    c: 'TreeSelect',
    p: {
      'aria-label': 'カテゴリ',
      placeholder: 'カテゴリを選ぶ',
      nodes: [
        {
          id: 'fruit',
          label: 'くだもの',
          children: [
            { id: 'apple', label: 'りんご' },
            { id: 'orange', label: 'みかん' },
          ],
        },
        {
          id: 'vegetable',
          label: 'やさい',
          children: [
            { id: 'carrot', label: 'にんじん' },
            { id: 'tomato', label: 'トマト' },
          ],
        },
      ],
    },
  },
  VisuallyHidden: {
    c: 'Button',
    p: { variant: 'outline' },
    k: ['★', { c: 'VisuallyHidden', k: ['お気に入りに追加'] }],
  },
  // どの値も文字と背景のコントラスト 7:1（AAA）を満たす組み合わせにしてある。
  ThemeOverride: {
    c: 'Stack',
    p: { gap: '4' },
    k: [
      { c: 'Button', k: ['既定のプライマリ'] },
      {
        c: 'ThemeOverride',
        p: {
          colors: {
            primary: '#115e59',
            'primary-hover': '#134e4a',
            'primary-active': '#042f2e',
            'on-primary': '#ffffff',
          },
        },
        k: [
          {
            c: 'Stack',
            p: { direction: 'horizontal', gap: '3' },
            k: [
              { c: 'Button', k: ['深い緑に上書き'] },
              { c: 'Button', p: { variant: 'outline' }, k: ['アウトライン'] },
            ],
          },
        ],
      },
      {
        c: 'ThemeOverride',
        p: {
          colors: { primary: '#1e40af', 'primary-hover': '#1e3a8a', 'on-primary': '#ffffff' },
        },
        k: [{ c: 'Button', k: ['藍色に上書き'] }],
      },
      {
        c: 'ThemeOverride',
        p: {
          dark: { primary: '#5eead4', 'primary-hover': '#99f6e4', 'on-primary': '#042f2e' },
        },
        k: [{ c: 'Button', k: ['ダークモードだけ上書き'] }],
      },
    ],
  },
};
