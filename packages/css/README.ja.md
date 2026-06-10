<!-- 日本語 | [English](README.md) -->

# @lily-ui/css

Lily UI の、フレームワークに依存しない CSS デザインライブラリです。デザイントークン、テーマ（ライト、ダーク、カスタム）、単機能のユーティリティクラス層、コンポーネントスタイルを提供します。単体でも（素の HTML、Vue、Svelte など）、[`@lily-ui/react`](../react) と組み合わせても使えます。

## インストール

```bash
pnpm add @lily-ui/css
```

```ts
// アプリのエントリで一度だけ読み込みます。
import '@lily-ui/css/styles';
```

## 使えるもの

- デザイントークン。`--lily-*` という CSS カスタムプロパティです（色、余白、タイポグラフィ、角丸、影、モーション、z-index、ブレークポイント）。
- テーマ。`data-theme`（`light` と `dark`）で切り替えます。`prefers-color-scheme` への自動フォールバックつきです。どのトークンも上書きして見た目を変えられます。
- ユーティリティクラス。`.lily-p-4`、`.lily-flex`、`.lily-text-muted` などです。モバイルファーストのレスポンシブ版（`.lily-md\:flex`）もあります。
- コンポーネントスタイル。`.lily-button` などで、マークアップに依存しません。

## SCSS ソースを使う

SCSS をビルドするなら、トークンやミックスインを直接使えます。

```scss
@use '@lily-ui/css/scss' as lily;

.my-card {
  padding: lily.var-ref('space-4');
  background: lily.var-ref('color-bg-surface');
  border-radius: lily.var-ref('radius-lg');
}
```

## ビルド

```bash
pnpm --filter @lily-ui/css build   # -> dist/lily-ui.css + dist/fonts.css
```

リポジトリルートのドキュメントもどうぞ。[テーマ](../../docs/theming.md)、[トークン](../../docs/tokens.md)、[アクセシビリティ](../../docs/accessibility.md)、[タイポグラフィ](../../docs/typography.md)。
