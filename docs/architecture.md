<!-- 日本語（正） | [English](en/architecture.md) -->

# アーキテクチャ

## モノレポの構成

```
.
├── packages/
│   ├── css/            @lily-ui/css   — CSS/SCSS design library (tokens, themes,
│   │   └── src/styles/                  utilities, component styles)
│   └── react/          @lily-ui/react — React components (markup, behavior, ARIA,
│       └── src/                         types). No styles of its own.
├── apps/
│   └── storybook/      @lily-ui/storybook — docs site (private)
├── docs/               human docs
└── .changeset/         versioning/release
```

管理には pnpm workspaces を使っています。`@lily-ui/css` と `@lily-ui/react` は Changesets でバージョンを連動させているので、いつも一緒にリリースされます。

## パッケージを二つに分けている理由

| 担うもの | 置き場所 |
| --- | --- |
| 見た目のデザイン（色、余白、文字、部品の見え方） | `@lily-ui/css` |
| 振る舞い、アクセシビリティの配線、React の型 | `@lily-ui/react` |

CSS ライブラリはフレームワークに依存しません。素の HTML でも、どんなフレームワークでも、プレーンな CSS ライブラリと同じように使えます。

React ライブラリは正しいクラス名と ARIA を出力し、操作のロジックを受け持ちます。`@lily-ui/css` を peer dependency として宣言しているので、スタイルの実体は一つだけになり、重複しません。

こうしておくと React のバンドルは最小限に保たれ、デザイン言語の進化も一か所に集約できます。

## トークンのパイプライン

```
primitives (raw scales)
   ↓  map onto intent
semantic tokens (per theme: light / dark / custom)
   ↓  emitted as CSS custom properties (--lily-*)
utilities (.lily-*)  +  component styles (.lily-button …)
   ↓  consumed by
@lily-ui/react components (class names) and your app
```

詳しくは [tokens.md](tokens.md) を見てください。TypeScript のトークン面（`@lily-ui/react/tokens`）は SCSS のキーをそのまま映しているので、型安全で AI にも扱いやすくなっています。

## ビルド

- `@lily-ui/css`では、`sass` が `src/styles/index.scss` を `dist/lily-ui.css` に、`fonts.scss` を `dist/fonts.css` にコンパイルします。生の SCSS も公開しているので、SCSS から使う人はそちらを利用できます（`@lily-ui/css/scss`）。
- `@lily-ui/react`では、Vite のライブラリビルドが ESM と CJS を出力し、`tsc` が `.d.ts` を出力します。`react`、`react-dom`、`@lily-ui/css` は外部化されます。

## SSR と SSG

- 既定のスタイルは `:root`（ライトスキーム）に置いてあるので、サーバーで描画した HTML は JS がなくても正しく表示されます。
- `ThemeProvider` が `window` や `document` に触れるのは、エフェクトの中だけです。
- `ThemeScript` はハイドレーションの前に保存済みのテーマを適用するので、FOUC を防げます。
