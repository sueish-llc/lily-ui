<!-- 日本語（正） | [English](en/framework-ports.md) -->

# フレームワーク移植: Vue と Web Components

Lily UI のコンポーネント層は3つのランタイム向けに提供しています。どれも同じマークアップを
描画し、スタイルは `@lily-ui/css` が当てます。

| パッケージ | ランタイム | 書き方 |
| --- | --- | --- |
| `@lily-ui/react` | React 18+ | `forwardRef` の TSX |
| `@lily-ui/vue` | Vue 3.5+ | SFC（`<script setup>`） |
| `@lily-ui/web-components` | どこでも（カスタム要素） | `LilyElement`（light DOM） |

正は React パッケージです。Vue / Web Components の各コンポーネントは、React 版の DOM 構造、
クラス名、`data-*` と ARIA 属性、キーボード操作をそのまま写します。違うのは書き方の流儀だけです。

## 共通ルール

- クラス名は `CLAUDE.md` の BEM 風スキーム（`lily-x`、`lily-x--mod`、`lily-x__part`）に従い、
  React から一字一句そのまま写す。
- スタイルはすべて `@lily-ui/css` にある。これらのパッケージが出力するのはクラス名だけ。
- ARIA のロール・状態とキーボード操作は React と同一に保つ。
- クラス文字列の組み立てには `cx()` を使う（実装は全パッケージで共通）。

## Vue の書き方（`packages/vue/src/components/<Name>/<Name>.vue`）

- `<script setup lang="ts">` の SFC。1コンポーネントにつき1 SFC で、複数パートのコンポーネントは
  パートごとに分ける（`Card.vue`、`CardHeader.vue` など）。
- 型のエクスポート（`export type FooStatus = …` や props のインターフェース）は、別建ての素の
  `<script lang="ts">` ブロックに置く。`<script setup>` の中には `export` 文を書けないため。
  そこでエクスポートした型は、パッケージのエントリから
  `export type { FooStatus } from './Foo.vue'` として再公開する。
- 利用者が付ける `class` や属性は、Vue の単一ルートへのフォールスルーに任せる。ライブラリ側の
  クラスは `:class="cx(...)"` で付け、マージは Vue がやってくれる。
- ポリモーフィックな `as` は `<component :is="as ?? 'div'">` で実現する。
- 既定値は `withDefaults(defineProps<…>(), { … })` で与える。
- 双方向の状態（`value` / `open` / `index`）には `defineModel()` を使い、controlled でも
  uncontrolled でも動くようにする。React のコールバックはイベントに対応させる
  （`onChange → update:modelValue` / `change`、`onOpenChange → update:open`、`onClose → close`）。
- React で `ReactNode` を受けていた props（`title` や `icon` など）は名前付きスロット
  （`#title`、`#icon`）にする。React 側で文字列を渡すのが普通だった props には、文字列の
  prop も残しておく。
- 配列・データ系の props（Accordion の `items`、Carousel の `slides`、Breadcrumb の `items`、
  Pagination）は、React と同じオブジェクト形の props のままにする。
- id は `import { useId } from 'vue'` で作る。
- フォーム部品は `../../composables/field` の `useFieldControl` を使い、返ってきた属性を
  `v-bind` で結びつける。
- オーバーレイは、ポータルに出す内容を `<Teleport to="body">` で包む。
  `../../composables/interactions` の `useFocusTrap` / `useDismiss` / `useScrollLock` を使う。
- `src/index.ts` は編集しない。エクスポートは一括で組み立てている。

お手本には `Button.vue`、`Alert.vue`、`Input.vue`、`FormField.vue`、`Card/*` の
各パート、`ThemeProvider.vue` を参照してください。

## Web Components の書き方（`packages/web-components/src/components/<Name>.ts`）

- 名前付きの `class Lily<Name> extends LilyElement` をエクスポートする（無名クラスだと
  `.d.ts` の出力が壊れる）。複数パートのコンポーネントは、1つのファイルから複数の名前付き
  クラスをエクスポートする。
- タグ名はケバブケースの `lily-<name>`（パートは `lily-<name>-<part>`）。例: `lily-button`、
  `lily-card-header`、`lily-form-field`。
- `static get observedAttributes(): string[]` と `protected build(): BuildResult` を実装する。
  `h()` と `this.attr/boolAttr/numAttr/cx` を使う。
- ベースクラスは light DOM に描画する。ホストは `display: contents` で、`build` は
  `{ root, slot? }` を返す。`root` が `lily-*` クラスを持ち、`slot`（既定は `root`）が利用者の
  書いた子要素を受け取る。子要素を自分で append してはいけない。
- `HTMLElement` のメンバーと衝突するフィールド名（`part`、`title`、`slot`、`dir`、`lang` など）は
  避ける。`partName` のように言い換える。
- ネイティブイベントはホストを自動で通り抜ける。合成イベントは
  `this.dispatchEvent(new CustomEvent('name', { bubbles: true, detail }))` で発火する
  （React の `onClose` → `close`、`onChange` → `change` などに対応させる）。
- 内部状態はプライベートフィールドに持ち、変更したら `this.rerender()` を呼ぶ。
  `connectedCallback` / `disconnectedCallback` を上書きするときは `super.connectedCallback()` を
  呼び、リスナー・タイマー・ポータルを片付ける。
- 配列・データ系の props は同名の JSON 属性で受け取り（`items='[…]'`、`slides='[…]'`）、
  `try/catch` の中で `JSON.parse` する。
- セキュリティ上の注意がひとつ。Carousel の `slides` 属性は、各要素の HTML 文字列を
  `innerHTML` でそのまま描画する。渡してよいのは信頼できる HTML だけで、ユーザー入力を
  渡すと XSS になる。
- id の生成は `../base/LilyElement` の `uid()` を使う。
- オーバーレイとポータルは、`open` 属性に応じて backdrop とパネルを作り、自分で
  `document.body.append(...)` する。`../base/interactions` の `lockScroll` / `trapFocus` /
  `listenDismiss` を使い、閉じたときと disconnect 時にポータルを取り除く。
- フォーム部品は内側にネイティブ要素を描画し、`this.forwardAttrs(inner, FORM_CONTROL_ATTRS)` を
  呼ぶ（size や type の扱いも含む）。ネイティブの `input` / `change` イベントは、そのまま
  ホストの外へ出ていく。
- `src/index.ts` と `src/elements.ts` は編集しない。登録は一括で組み立てている。

お手本には `Button.ts`、`Badge.ts`、`Alert.ts`、`Card.ts`、`Spinner.ts`、
`base/LilyElement.ts`、`base/interactions.ts` を参照してください。

## 例外: Scrollspy

Scrollspy は3つのランタイムで形をそろえていません。React はフック（`useScrollspy`）、Vue は
コンポーザブル（`useScrollspy`）、Web Components はユーティリティ関数（`createScrollspy`）と、
それぞれのフレームワークの流儀に合わせています。意図した設計なので、形をそろえる方向に
直さないでください。
