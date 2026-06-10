<!-- 日本語（正） | [English](en/design-language.md) -->

# デザイン言語「彩（さい）」

Lily UI の見た目はトークンで決まります。色・形・余白・文字・動きは部品ごとに決めず、このページとデザイントークンに従います。

## 原則

- やわらかい：大きめの角丸、広いぼかしの影、控えめな動き。
- あたたかい：少し暖かみのある地（笹百合の主役と暖色の状態色）に、藤（菫色）の宝石色を差し色として効かせる。
- 親しみやすい：色の役割を固定し、日本語をゆったり組む。

## 色

色はすべてセマンティックトークン `--lily-color-*` 経由で使います。生のパレット値（`brand-500` など）を部品から直接呼ばないでください。トークンの値はライト/ダークで変わるので、特定の色名では呼ばず役割で扱います（下表は両モードの実値）。

### ブランドカラー

| 役割    | トークン               | ライト    | ダーク    |
| ------- | ---------------------- | --------- | --------- |
| primary | `--lily-color-primary` | `#d22879` | `#ef88c1` |
| accent  | `--lily-color-accent`  | `#8442c6` | `#ba94e4` |

primary は主要ボタン・リンク・選択状態に、accent は強調と装飾に使います。どちらも状態を示すのには使いません。primary と accent は色相を分け、同じ用途では混ぜません。primary は笹百合（ささゆり）由来の、やや青み（マゼンタ）に寄せた**深いピンク（色相 ≈ 331°）**で、緋色の `danger`（レッド・色相 ≈ 6°）とはっきり判別できます。accent は**藤（ふじ・wisteria）の菫色（色相 ≈ 270°）**で、あえて暖色帯の外に置いています。暖色のアクセントは、AAA のために暗くすると暖色の `warning`（琥珀）と茶系に潰れて見分けがつかなくなるためで、寒色の宝石色にすることで danger・warning・accent をすべて分離しています。役割は色相環に分散（緋 6°・琥珀 39°・緑 136°・藍 228°・藤 270°・笹百合 331°）。色相はライト/ダークで変わりません。ソリッド面の実値は AAA を満たすため深いステップ（ライト 700・ダーク 300）を使います。色名はすべて**日本の伝統色（和色）**で統一しています — 主役は花の和色（笹百合・藤・桜）、状態色は緋・琥珀・緑・藍で、役割がひと目で分かる名前にしています。

グラデーションは `--lily-color-accent-gradient`（accent）と `--lily-color-primary-gradient`（primary）の2つです。多用すると効果が薄れるので、1画面に1か所までを目安にするのがおすすめです。

### 背景とテキスト

| 役割           | トークン                  | ライト    | ダーク    |
| -------------- | ------------------------- | --------- | --------- |
| background     | `--lily-color-bg-canvas`  | `#faf9f7` | `#0b0908` |
| surface        | `--lily-color-bg-surface` | `#ffffff` | `#14110e` |
| text           | `--lily-color-fg-default` | `#14110e` | `#faf9f7` |
| text-secondary | `--lily-color-fg-muted`   | `#38332d` | `#d3cdc4` |
| text-tertiary  | `--lily-color-fg-subtle`  | `#534d45` | `#a49d92` |

### 状態色

`danger` / `warning` / `success` / `info` の4色。状態を示すときだけに使い、装飾には使いません。

### コントラスト（WCAG 2.1 AAA）

- 文字と背景は全組み合わせで AAA（本文 7:1、大きい文字 4.5:1）を満たします。境界線などの非テキストは 3:1 です。
- 本文サイズの有色テキスト・リンクには `--lily-color-*-text` を使います（`primary-text` / `accent-text` / `danger-text` / `warning-text` / `success-text` / `info-text`）。これらが AAA を担保します。
- 有色の面（ボタン等）に白文字を置く場合、標準サイズは AA（約 5:1）です。AAA にするにはラベルを大きい文字（18.66px 以上の太字、または 24px 以上）にします。
- ダークモードは同名トークンに別の値を割り当てます。全部品が light / dark の両方で動きます。

## 形

角丸は少し大きめです。

| トークン             | 値   | 用途                     |
| -------------------- | ---- | ------------------------ |
| `--lily-radius-sm`   | 6px  | バッジ、小さなタグ       |
| `--lily-radius-md`   | 10px | ボタン、入力欄           |
| `--lily-radius-lg`   | 14px | カード、モーダル         |
| `--lily-radius-xl`   | 20px | 大きなパネル、ヒーロー   |
| `--lily-radius-2xl`  | 28px | とくに大きな囲み         |
| `--lily-radius-pill` | 最大 | タグ、チップ、丸いボタン |

境界線は 1px を基本にし、浮きは影で表します。線と影を同時に強くしないでください。影は既定で `--lily-shadow-md`、重なる要素（モーダル・ポップオーバー）だけ `lg` / `xl` にします。

## 余白

4px グリッド `--lily-space-*` で決めます。px の直書きはしません。

`data-density` で密度を切り替えます。

| `data-density`        | 用途                           | 効果                   |
| --------------------- | ------------------------------ | ---------------------- |
| `comfortable`（既定） | ブランドサイト、一般向けアプリ | 標準のコントロール高   |
| `compact`             | 業務システム、管理画面         | コントロール高を縮める |

```html
<body data-density="compact">
  …
</body>
```

## 文字

詳細は [typography.md](typography.md)。要点：

- 本文の行間は `--lily-leading-relaxed`（1.7）、長文は `--lily-leading-ja`（1.85）。字間は `--lily-tracking-ja`。
- 約物・かなの詰めは `font-feature-settings: 'palt'`。
- 禁則（`line-break: strict`）、文節改行（`word-break: auto-phrase`）、見出しの `text-wrap: balance`、本文の `text-wrap: pretty` はリセットで既定有効。
- 書体は LINE Seed JP を先頭に、システムフォントを後ろに並べます。

## 動き

既定は `--lily-duration-base`（200ms）+ `--lily-ease-standard`。`prefers-reduced-motion` はリセットで全体に尊重します。

## チェックリスト

- 色はセマンティックトークン経由か。生値の直書きはないか。
- 本文サイズの有色テキストは `--lily-color-*-text`（AAA）を使っているか。
- 角丸・影・余白はトークンか。px の直書きはないか。
- グラデーションは1画面1か所までか。
- 行間・禁則・`text-wrap` が効いているか。
- テキストのコントラストは light / dark とも AAA か。
- `prefers-reduced-motion` で過剰な動きが止まるか。

トークン一覧は [tokens.md](tokens.md)、AI 向けの使い方は [ai-usage.md](ai-usage.md) を参照してください。
