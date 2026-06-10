<!-- 日本語（正） | [English](en/tokens.md) -->

# デザイントークン

トークンは三つの層で組み立てています。コンポーネントが参照するのは常に semantic 層だけです。そこから派生したユーティリティクラスを使ってもかまいません。

```
primitives  →  semantic (theme)  →  components / utilities
  raw scales     intent + theme        consumption
```

## 層

1. primitives（`packages/css/src/styles/tokens/_primitives.scss`）
   テーマに依存しない生の Sass マップです。色のランプ、4px の余白グリッド、文字スケール、角丸、影、モーション、z-index、ブレークポイントを持ちます。リテラル値を定義する唯一の場所で、ほかの場所にマジックナンバーは一切ありません。

2. semantic（`packages/css/src/styles/themes/_schemes.scss`）
   意図を名前にしたトークン（`color-fg-default`、`color-primary` など）を primitives に対応づけたものです。テーマごとに一度だけ定義します（`$light`、`$dark`）。`themes/_root.scss` が CSS カスタムプロパティとして出力します。

3. consumption（使う側）
   - SCSS では `fn.var-ref('color-primary')` が `var(--lily-color-primary)` になります。
   - CSS では `var(--lily-space-4)` のように書きます。
   - ユーティリティクラスは `.lily-p-4`、`.lily-text-muted`、`.lily-bg-surface` などです。
   - TypeScript では `cssVar('color-primary')` と型付きのキー（`@lily-ui/react/tokens`）を使います。

## 命名

| グループ                    | パターン                                     | 例                     |
| --------------------------- | -------------------------------------------- | ---------------------- |
| Spacing                     | `--lily-space-{key}`                         | `--lily-space-4`       |
| Radius                      | `--lily-radius-{key}`                        | `--lily-radius-md`     |
| Font size                   | `--lily-text-{key}`                          | `--lily-text-lg`       |
| Font weight                 | `--lily-weight-{key}`                        | `--lily-weight-bold`   |
| Shadow                      | `--lily-shadow-{key}`                        | `--lily-shadow-md`     |
| Color (semantic)            | `--lily-color-{role}`                        | `--lily-color-primary` |
| Color (palette scale)       | `--lily-color-{role}-{step}`                 | `--lily-color-primary-100` |
| Motion                      | `--lily-duration-{key}`, `--lily-ease-{key}` | `--lily-duration-fast` |
| Z-index                     | `--lily-z-{layer}`                           | `--lily-z-modal`       |
| Control height              | `--lily-control-h-{key}`                     | `--lily-control-h-md`  |
| Size (component dimensions) | `--lily-size-{key}`                          | `--lily-size-md`       |

### パレットの段階トークン

セマンティックトークンの素になっている色のランプ（笹百合・藤・桜と、状態色の緋・琥珀・緑・藍）は、`--lily-color-{role}-{step}` という形でも公開しています。`step` は 50（明るい）から 900（暗い）までで、`role` は `primary`・`accent`・`danger`・`warning`・`success`・`info`・`neutral`・`sakura` です。たとえば `--lily-color-primary-100` は笹百合の薄い段階です。これらはテーマで切り替わらず、常に同じ値を返します。

ただし、ふだんの実装では役割で選ぶセマンティックトークン（`--lily-color-primary` など）を使ってください。段階トークンは、図版やツール、特定の段階がどうしても必要な個別の調整に使うものです。コンポーネントの中で段階を直接指定すると、テーマ切り替えの恩恵を受けられなくなります。

> spacing と size の違いについて。`--lily-space-*` はパディングやマージン、間隔のための 4px スケールです。`--lily-size-*` はコンポーネントの寸法のための別のスケールで、モーダルやオフキャンバス、トーストの幅、ドロップダウンやツールチップの上限などに使います。パネルの寸法を spacing トークンで決めてはいけません。size トークンは `100%` やビューポートの上限と組み合わせて、レスポンシブに保ってください。たとえば `min(var(--lily-size-sm), calc(100vw - …))` のように書きます。

## トークンを追加・変更するには

1. `@lily-ui/css` の `_primitives.scss`（primitives）または `_schemes.scss`（semantic）で値を追加・調整します。
2. JS や TS から使う側がそのキーを必要とするなら、`packages/react/src/tokens/index.ts` に同じものを反映します。
3. ユーティリティとコンポーネントは自動で拾います。コンポーネントごとの編集は不要です。

## TypeScript での使い方

```ts
import { cssVar, type SemanticColorToken } from '@lily-ui/react/tokens';

const style = { color: cssVar('color-primary') }; // "var(--lily-color-primary)"
```
