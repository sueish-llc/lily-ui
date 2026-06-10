<!-- 日本語 | [English](README.md) -->

# @lily-ui/vue

Lily UI の、アクセシブル（WCAG 2.1 AAA）で SSR / SSG に対応した Vue 3 コンポーネントライブラリです。マークアップ、振る舞い、ARIA 属性の紐付け、型を提供し、見た目のスタイルは [`@lily-ui/css`](../css) が担います。コンポーネントの構成は [`@lily-ui/react`](../react) と一対一で対応していて、クラス名も DOM もアクセシビリティも同じです。

## インストール

```bash
pnpm add @lily-ui/vue @lily-ui/css vue
```

```vue
<script setup lang="ts">
// アプリのエントリで一度だけ読み込みます。
import '@lily-ui/css/styles';
import { ThemeProvider, Button } from '@lily-ui/vue';
</script>

<template>
  <ThemeProvider default-mode="system">
    <Button status="primary" @click="$emit('hello')">こんにちは</Button>
  </ThemeProvider>
</template>
```

## 規約

- コンポーネントは名前付きエクスポートです。`import { Button, Card, CardHeader } from '@lily-ui/vue'` のように読み込みます。
- props はデザインシステム全体で共通です（`status`、`size`、`variant`、`block`）。利用者が付けた `class` は自動でマージされます。
- 双方向の状態は `v-model` で扱います（例: `<Input v-model="name" />`、`<Modal v-model:open="open" />`、`<Tabs v-model="activeId" :items="…" />`）。
- リッチな内容（`title`、`icon`、Dropdown のトリガーなど）は名前付きスロットで渡します。文字列で済む場面では文字列の prop も受け付けます。
- オーバーレイ（`Modal`、`Offcanvas`、`ToastProvider`）は `<Teleport>` で body 直下に描画し、フォーカストラップとスクロールロック、Escape キーや背景クリックで閉じる処理まで引き受けます。

## テーマ

`ThemeProvider` が `<html data-theme>` を同期します。SSR のハイドレーション時に誤ったテーマが一瞬見えるのを防ぐには、`themeScript()` をドキュメントの `<head>` に注入してください（Nuxt なら `useHead` などで）。詳しくは[テーマのドキュメント](../../docs/theming.md)と [framework-ports](../../docs/framework-ports.md) を参照してください。

## 型安全なトークン

```ts
import { cssVar } from '@lily-ui/vue/tokens';

const style = { color: cssVar('color-primary') }; // "var(--lily-color-primary)"
```

## 開発

```bash
pnpm --filter @lily-ui/vue build       # ESM + CJS + d.ts（vue-tsc）
pnpm --filter @lily-ui/vue typecheck
```
