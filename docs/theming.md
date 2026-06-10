<!-- 日本語（正） | [English](en/theming.md) -->

# テーマとダークモード

## 仕組み

テーマで切り替わる値は、すべて `@lily-ui/css` の SCSS から出力される CSS カスタムプロパティ（`--lily-*`）です。

- `:root` がライトのスキームとすべてのプリミティブトークンを持ちます。SSR でも正しく表示されます。
- `:root[data-theme="dark"]` がセマンティックな色の変数を上書きします。
- `data-theme` を指定しなければ、`prefers-color-scheme` が自動で判断します。

そのためテーマの切り替えは属性をひとつ変えるだけで済みます。部品を再描画する必要はなく、初期描画には JavaScript もいりません。

## React での使い方

```tsx
import { ThemeProvider, useTheme } from '@lily-ui/react';

function ThemeToggle() {
  const { resolvedTheme, toggle } = useTheme();
  return <button onClick={toggle}>{resolvedTheme === 'dark' ? '🌙' : '☀️'}</button>;
}

<ThemeProvider defaultMode="system">{/* ... */}</ThemeProvider>;
```

- `mode` は `'light' | 'dark' | 'system'` です。
- `resolvedTheme` は実際に適用されている `'light'` か `'dark'` の値です。
- `setMode(mode)` と `toggle()` で切り替えます。

## SSR や SSG でのちらつき（FOUC）を防ぐ

小さなインラインスクリプトを `<head>` に描画しておくと、ハイドレーションの前に保存済みのテーマが適用されます。

```tsx
// app/layout.tsx (Next.js)
import { ThemeScript } from '@lily-ui/react';

export default function RootLayout({ children }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## 独自のカラーテーマやブランド上書き

すべてが CSS 変数なので、セマンティックトークンを上書きすればシステム全体の見た目を作り替えられます。ビルドし直す必要はありません。

```css
:root {
  --lily-color-primary: #7c3aed;
  --lily-color-primary-hover: #6d28d9;
  --lily-color-on-primary: #ffffff;
}
[data-theme='dark'] {
  --lily-color-primary: #a78bfa;
}
```

ブランドごとのスコープを定義して、そこへ切り替えることもできます。

```css
[data-theme='brand-x'] {
  --lily-color-primary: #ff6f00;
}
```

```tsx
document.documentElement.setAttribute('data-theme', 'brand-x');
```

> アクセシビリティ。色を上書きするときは、文字と背景の組み合わせを WCAG AAA のコントラストに保ってください。本文は 7 対 1 以上、大きい文字は 4.5 対 1 以上、UI の境界線は 3 対 1 以上が目安です。詳しくは [accessibility.md](accessibility.md) を参照してください。
