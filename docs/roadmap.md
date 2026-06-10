<!-- 日本語（正） | [English](en/roadmap.md) -->

# コンポーネント一覧と今後の予定

Lily UI がいま提供しているコンポーネントの一覧です。どのコンポーネントも React / Vue / Web Components の3パッケージで同じマークアップ・クラス名・ARIA を持ち、CSS パーシャル（セマンティックトークンのみ）、Storybook の stories、挙動テストと vitest-axe の a11y テストが付属します。動く状態のカタログは Storybook とドキュメントサイトで確認できます。

## レイアウト

Affix / Container / Divider / Footer / Grid（Row・Col、レスポンシブ12カラム）/ Ratio / ScrollArea / Splitter / Stack / VisuallyHidden

## タイポグラフィ

CodeBlock / Kbd・Code / Link / Mark / Text・Heading

## アクション

Button / ButtonGroup / CloseButton / CopyButton / FloatButton / Toolbar

## フォーム

Calendar / Cascader / Checkbox / ColorPicker / Combobox / DatePicker / DateRangePicker / DateTimePicker / DurationInput / Fieldset / FileUpload / FloatingLabel / FormField / Input / InputGroup / MonthPicker / NumberInput / PinInput / Radio / Range / RangeDual / Rating / SegmentedControl / Select / Switch / TagInput / Textarea / TimePicker / TimeZoneSelect / Transfer / TreeSelect

日付・時刻系（Calendar、DatePicker、DateRangePicker、DateTimePicker、MonthPicker、TimePicker、DurationInput、TimeZoneSelect）は値の型に Temporal API を使います。詳しくは [CLAUDE.md](../CLAUDE.md) の Date & time の節を参照してください。

## ナビゲーション

BackTop / Breadcrumb / Menu / Navbar / Pagination / Stepper / Tabs / Tree

スクロール位置に応じたナビ強調はコンポーネントではなく関数で提供します（React と Vue は `useScrollspy`、Web Components は `createScrollspy`）。

## データ表示

Avatar・AvatarGroup / Badge / Card / Chip / Countdown / Descriptions / ListGroup / RelativeTime / Stat / Table / Timeline

## メディア

Carousel / Icon / Image / Watermark

## 開閉

Accordion / Collapse / Presence

## フィードバック

Alert / EmptyState / Meter / Progress / Result / Skeleton / Spinner / Toast

## オーバーレイ

AlertDialog / CommandPalette / ContextMenu / Drawer / Dropdown / HoverCard / Modal / Offcanvas / Popover / Tooltip

## スタイリング基盤

- デザイントークン（色、余白、文字、角丸、影、モーション、z-index、ブレークポイント）
- テーマ（light / dark / system、カスタムテーマ、ThemeOverride による利用者単位の上書き）
- ユーティリティクラス（余白、レイアウト、flex、文字、色、a11y）
- リセットとベーススタイル、LINE Seed タイポグラフィ（任意）
- モーション層（[motion.md](motion.md)）
- 共有フック（useControllableState、フォーカストラップ、dismiss、スクロールロック）

## 今後の予定

スタイリング層にはまだ足りないものがあります。次の項目を追加する予定です。

- タイポグラフィの役割プリセット（display / title / body / label / caption）
- 状態レイヤのトークン（hover / active / selected で上に重ねる不透明度）
- 不透明度のスケール（`--lily-opacity-*`）
- backdrop-blur のトークン（すりガラス面）
- border-width のスケール
- フォーカスリングの offset トークン
- 段差のあるサーフェス（`bg-elevated` 系）
- コンテナクエリ対応のユーティリティ

## すべてのコンポーネントが満たすべきこと

1. キーボードで操作でき、スクリーンリーダー向けにラベル付けされていること。
2. `*.a11y.test.tsx`（vitest-axe）と Storybook の a11y アドオンを通ること。
3. セマンティックな CSS 変数トークンだけを使うこと。インラインのマジックナンバーは使わない。
4. JSDoc と autodocs 付きの `*.stories.tsx` を備えること。
5. `ref` の転送に対応し、妥当な場面ではポリモーフィックな `as` prop にも対応すること。
6. React / Vue / Web Components の3パッケージすべてに、同じ DOM・クラス名・キーボード操作で存在すること。
