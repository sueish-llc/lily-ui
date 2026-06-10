<!-- 日本語 | [English](README.md) -->

# @lily-ui/react

Lily UI の、アクセシブル（WCAG 2.1 AAA）で SSR と SSG にも対応した React コンポーネントライブラリです。マークアップ、振る舞い、ARIA の配線、型を提供します。見た目のスタイルは [`@lily-ui/css`](../css) が受け持ちます。

## インストール

```bash
pnpm add @lily-ui/react @lily-ui/css
```

```tsx
// アプリのエントリで一度だけ読み込みます。
import '@lily-ui/css/styles';

import { ThemeProvider, Button } from '@lily-ui/react';

export function App() {
  return (
    <ThemeProvider defaultMode="system">
      <Button status="primary" onClick={() => alert('こんにちは')}>
        こんにちは
      </Button>
    </ThemeProvider>
  );
}
```

ダークモードで画面のちらつきを防ぐには、ドキュメントの `<head>` に `<ThemeScript />` を描画してください。詳しくは[テーマのドキュメント](../../docs/theming.md)を参照してください。

## 型安全なトークン

```ts
import { cssVar } from '@lily-ui/react/tokens';

const style = { color: cssVar('color-primary') }; // "var(--lily-color-primary)"
```

## 開発

```bash
pnpm --filter @lily-ui/react test        # 単体テストと a11y
pnpm --filter @lily-ui/react build       # ESM + CJS + d.ts
```
