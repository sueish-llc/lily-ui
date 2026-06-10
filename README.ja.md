<!-- 日本語 | [English](README.md) -->

# Lily UI

> トークン駆動でアクセシブルなデザインシステムです。フレームワークに依存しない CSS ライブラリと、React・Vue・Web Components それぞれのコンポーネントライブラリを、pnpm モノレポで提供しています。

Lily UI は2つの層からできています。どこでも使える低レベルのスタイリング基盤（デザイントークンとユーティリティクラス）と、よくある UI コンポーネントをひととおりそろえた高レベルのコンポーネント群です。コンポーネントは React・Vue・カスタム要素の3つで同じものを提供します。アクセシビリティ（WCAG 2.1 AAA）、SSR と SSG での安全性、ダークモードとカスタムテーマ、そして日本語ファーストの組版を軸に作っています。推奨書体は LINE Seed（SIL Open Font License 1.1）です。

## パッケージ

| パッケージ                             | 中身                                                                                                             | 公開      |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------- |
| [`@lily-ui/css`](packages/css)         | デザイントークン、テーマ、ユーティリティクラス、コンポーネントスタイル。フレームワークに依存しない CSS と SCSS。 | ✅        |
| [`@lily-ui/react`](packages/react)     | React コンポーネント。マークアップ、振る舞い、ARIA、型。スタイルは `@lily-ui/css` から。                         | ✅        |
| [`@lily-ui/vue`](packages/vue)         | Vue 3 コンポーネント。React 版と一対一で対応。スタイルは `@lily-ui/css` から。                                     | ✅        |
| [`@lily-ui/web-components`](packages/web-components) | フレームワークに依存しないカスタム要素（`<lily-*>`、light DOM）。スタイルは `@lily-ui/css` から。 | ✅        |
| [`@lily-ui/storybook`](apps/storybook) | Storybook のドキュメントとプレビューサイト。                                                                     | 🚫 非公開 |
| [`@lily-ui/docs`](apps/docs)           | ブランド兼ドキュメントサイト（Astro）。GitHub Pages で公開。                                                     | 🚫 非公開 |

## クイックスタート

```bash
pnpm add @lily-ui/react @lily-ui/css
```

```tsx
import '@lily-ui/css/styles';
import { ThemeProvider, Button } from '@lily-ui/react';

export function App() {
  return (
    <ThemeProvider defaultMode="system">
      <Button status="primary">こんにちは</Button>
    </ThemeProvider>
  );
}
```

## 開発（モノレポ）

```bash
pnpm install
pnpm dev              # Storybook（apps/storybook）を :6006 で起動
pnpm test             # 各パッケージの単体テストと a11y テスト
pnpm build            # 公開4パッケージ（css・react・vue・web-components）をビルド
pnpm lint             # eslint と stylelint
```

pnpm（`corepack enable`）と Node 26 以上が必要です。Node 26 を対象にしているのは、ランタイムが [Temporal API](https://tc39.es/proposal-temporal/docs/) をネイティブに備えているからです。`@lily-ui/react` の日付ヘルパーは Temporal を前提にしているので、ネイティブ対応がないランタイム（古い Node やほとんどのブラウザ）では、アプリ起動時に [`temporal-polyfill`](https://www.npmjs.com/package/temporal-polyfill) などのポリフィルを読み込んでください（`import 'temporal-polyfill/global';`）。

## ドキュメント

ドキュメントは日英の二言語です。日本語が正で、`docs/` 直下にあります。英語の訳は [`docs/en/`](docs/en/) にあります。各ページの先頭から、もう一方の言語へ行き来できます。

- [デザイン言語「彩（さい）」](docs/design-language.md)（すべてのトークンの土台となる世界観）
- [AI 向けの使い方ガイド](CLAUDE.md)（人にも AI にも共通の規約）
- [アーキテクチャ](docs/architecture.md)
- [テーマとダークモード](docs/theming.md)
- [タイポグラフィと LINE Seed のセットアップ](docs/typography.md)
- [アクセシビリティ](docs/accessibility.md)
- [デザイントークン](docs/tokens.md)
- [モーション](docs/motion.md)
- [フレームワーク移植（Vue と Web Components）](docs/framework-ports.md)
- [コンポーネント一覧と今後の予定](docs/roadmap.md)
- [コントリビュート](CONTRIBUTING.md)

## ライセンス

このプロジェクト自身のコードとスタイルは MIT ライセンスです。

推奨書体の LINE Seed は、SIL Open Font License 1.1 のもとで別途配布されていて、それぞれの権利者に帰属します。このプロジェクトは書体を名前で参照するだけで、フォントファイルを同梱したり再配布したりはしていません。ファイル本体は、フォント自身のライセンスに従ってあなた自身でホストしてください。
