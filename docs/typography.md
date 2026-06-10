<!-- 日本語（正） | [English](en/typography.md) -->

# タイポグラフィと LINE Seed のセットアップ

Lily UI は主要書体に LINE Seed を推奨しています。Web フォントが読み込まれる前でも、読み込めなくても UI が問題なく使えるように、堅実なシステムフォントのフォールバックも用意しています。LINE Seed は SIL Open Font License バージョン 1.1 のもとで配布されています。LINE Seed という名称は、それぞれの権利者に帰属するフォント名です。

## フォントを同梱していない理由

`font-family` で書体を名前で参照するだけなら再配布にはあたらないので、義務は生じません。フォントファイル本体を同梱する場合は、OFL のもとでライセンス文と著作権表示を一緒に配布する必要があります。手順をシンプルに保つため、`@lily-ui/css` が同梱するのは `font-family` のスタックと、オプトインの `@font-face` スタイルシートだけにしています（`dist/fonts.css` にビルドされます）。ファイル本体は、フォント自身のライセンスに従ってあなた自身でホストしてください。

## セットアップ

1. LINE Seed JP を <https://seed.line.me/index_jp.html> からダウンロードします。
2. `.woff2` ファイルを、アプリが静的アセットを配信する場所に置きます（たとえば `public/fonts/`）。
3. フォントフェイスを読み込みます。やり方は次のいずれかです。

   a) オプトインのスタイルシートをインポートする（ファイルが `/fonts` にある前提です）。

   ```ts
   import '@lily-ui/css/styles/fonts';
   ```

   b) もしくは、パスを指定して SCSS をコンパイルする。

   ```scss
   @use '@lily-ui/css/scss/fonts' with (
     $font-path: '/assets/fonts'
   );
   ```

   c) もしくは、`packages/css/src/styles/fonts.scss` の `@font-face` ルールを自分のグローバル CSS にコピーする。

4. パフォーマンスのために、主要なウェイトをプリロードします。

   ```html
   <link
     rel="preload"
     href="/fonts/LINESeedJP_A_Rg.woff2"
     as="font"
     type="font/woff2"
     crossorigin
   />
   ```

## 文字スケール

フォントのサイズ、ウェイト、行の高さ、字間はすべてトークン（`--lily-text-*`、`--lily-weight-*`、`--lily-leading-*`、`--lily-tracking-*`）とユーティリティクラス（`.lily-text-lg`、`.lily-font-bold` など）で扱います。ルートのフォントサイズは決め打ちにしていません。ユーザーのブラウザ設定を尊重するので、ズームや「大きな文字」のアクセシビリティ設定がそのまま効きます。

## 和文組版

Lily UI は日本語ファーストです。`reset` が CJK にちょうどいい既定値を当てるので、テキストは何もしなくても読みやすく組まれます。

行間
: 和文はラテン文字よりも余白が要ります。本文は既定で `--lily-leading-relaxed`（1.7）です。長く読ませる文章には `--lily-leading-ja`（1.85）も使えます。見出しには `--lily-leading-snug` を使います。

字間
: 本文は `--lily-tracking-ja` で字間をほんの少し開けます。

約物とかなの詰め
: `font-feature-settings: 'palt'` を当てると、手作業のカーニングではなく、フォントが持つ自然な全角約物やかなの幅が使われます。

行分割（禁則と文節）
: `line-break: strict` で約物を行頭に出しません。`word-break: auto-phrase` は本文を自然な文節の切れ目で折り返します（対応ブラウザのみ）。`overflow-wrap: anywhere` は長いラテン文字列や URL が狭い画面ではみ出すのを防ぎます。

折り返しのバランス
: 見出しは `text-wrap: balance`、本文は `text-wrap: pretty` を使い、行末に文字が1つだけ残る不自然な改行を避けます。

これらはプログレッシブエンハンスメントです。あるプロパティに対応していないブラウザは、ひとつ前の挙動にそのまま戻るだけで、レイアウトが崩れることはありません。
