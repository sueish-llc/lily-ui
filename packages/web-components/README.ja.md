<!-- 日本語 | [English](README.md) -->

# @lily-ui/web-components

Lily UI の、アクセシブル（WCAG 2.1 AAA）でフレームワークに依存しない Web Components です。カスタム要素なので、どのフレームワークにも、フレームワークを使わないページにもそのまま置けます。コンポーネントの構成は [`@lily-ui/react`](../react) と一対一で対応していて、クラス名も DOM もアクセシビリティも同じです。

## light DOM で描画する設計

Lily のスタイルはグローバルな [`@lily-ui/css`](../css) 層（素のクラス名と `data-theme` / `data-density`）にあります。これを活かすため、Lily の要素は shadow root を使わず、light DOM に中身を描画します。各 `<lily-*>` ホストは `display: contents` で、正しい `lily-*` クラスを持つ実際のセマンティック要素（たとえば `<button>`）を描画します。結果として React / Vue の出力と同一のマークアップになり、テーマがそのまま効き、ネイティブのセマンティクスとイベントバブリングも保たれます。

## インストール

```bash
pnpm add @lily-ui/web-components @lily-ui/css
```

```ts
// アプリのエントリで一度だけ読み込みます。
import '@lily-ui/css/styles';
import '@lily-ui/web-components/define'; // すべての <lily-*> 要素を登録
```

```html
<lily-button status="primary" variant="solid">こんにちは</lily-button>

<lily-card>
  <lily-card-header>Header</lily-card-header>
  <lily-card-body><lily-card-title>Title</lily-card-title>Body</lily-card-body>
</lily-card>
```

一部の要素だけ自分で登録したい場合は、`/define` の import をやめてレジストリを呼びます。

```ts
import { defineLilyElements } from '@lily-ui/web-components';
defineLilyElements();
```

## 規約

- タグはケバブケースの `lily-<name>` です（パートは `lily-<name>-<part>`、例: `lily-card-header`）。
- props は属性で渡します（`status`、`size`、`variant`、`block` など）。真偽値の props は属性の有無で表します（`<lily-button block loading>`）。
- React で配列やオブジェクトを受け取るコンポーネントは、同名の JSON 属性を受け付けます（例: `<lily-tabs items='[{"id":"a","label":"A","content":"…"}]'>`）。
- ネイティブイベント（`click`、`input`、`change`）はホストの外へそのままバブルします。合成イベントは `CustomEvent`（`close`、`change`）として発火します。
- オーバーレイは `document.body` 直下に描画し、フォーカストラップとスクロールロック、閉じる操作を管理します。トーストは `toast({ message: 'Saved' })` の形で命令的にも呼べます。

## テーマとトークン

祖先要素に `data-theme="light|dark"`（省略すると OS に追従）と `data-density="compact"` を設定します。詳しくは[テーマのドキュメント](../../docs/theming.md)を参照してください。トークンを型安全に参照するには次のように書きます。

```ts
import { cssVar } from '@lily-ui/web-components/tokens';
cssVar('color-primary'); // "var(--lily-color-primary)"
```

## 開発

```bash
pnpm --filter @lily-ui/web-components build       # ESM + CJS + d.ts
pnpm --filter @lily-ui/web-components typecheck
```
