<!-- 日本語（正） | [English](en/motion.md) -->

# モーション（アニメーション）

Lily のモーションは、**使うだけで正しく動く**ことを目指しています。値はすべてトークンから
生成され、AAA のアクセシビリティを満たし、React / Vue / Web Components で同じように動きます。

機能は次の3つです。

- アニメーションのユーティリティクラス。`.lily-animate` と約 80 種類の `--<name>` クラスです。
- 動きの強さの切り替え。`data-motion` で「なめらか」と「最低限」を切り替えます。
- presence。要素の表示・非表示に合わせて、enter / exit のアニメーションを付けます。

---

## 1. アニメーション・ユーティリティ

animate.css と同じ 2 クラスモデルです。ベース `.lily-animate` に、アニメ名モディファイア
`.lily-animate--<name>` を足します。

```html
<div class="lily-animate lily-animate--fade-in-up">こんにちは</div>
```

### カタログ（カテゴリ）

| カテゴリ | 例 |
| --- | --- |
| 入場（Entrances） | `fade-in`, `fade-in-up`(`-big`), `zoom-in`, `slide-in-left`, `bounce-in`, `flip-in-x`, `back-in-up`, `roll-in`, `light-speed-in-right`, `jack-in-the-box` |
| 退場（Exits） | `fade-out`, `zoom-out`, `slide-out-down`, `bounce-out`, `flip-out-y`, `back-out-left`, `roll-out`, `light-speed-out-left`, `hinge` |
| 注意喚起（Attention） | `bounce`, `flash`, `pulse`, `rubber-band`, `shake-x`/`shake-y`, `head-shake`, `swing`, `tada`, `wobble`, `jello`, `heart-beat` |

完全な一覧は Storybook の **Foundations/Animations** で再生して確認できます。

### 制御モディファイア（すべてトークン由来）

| 目的 | クラス |
| --- | --- |
| 長さ | `--fast`(500ms) / `--base`(800ms) / `--slow`(1200ms) / `--slower`(2000ms) |
| 遅延 | `--delay-sm` / `--delay-md` / `--delay-lg` / `--delay-xl` |
| 繰り返し | `--infinite` / `--repeat-2` / `--repeat-3` |
| イージング | `--ease-emphasized` / `--ease-accelerate` |
| UI 尺（オーバーレイ用） | `--snappy`（`--lily-duration-base` = 200ms） |

```html
<div class="lily-animate lily-animate--pulse lily-animate--infinite">●</div>
```

> 値はすべて `packages/css/src/styles/tokens/_primitives.scss` の
> `$animate-duration` / `$animate-delay` から生成されます。マジックナンバーはありません。

### 型付きヘルパー（React / Vue / Web Components）

イベントで再生したいときは `useAnimate`（WC は `animate()`）を使います。同じ名前を当て直すと
再トリガし、実行中だけ `will-change` を付けて終了で外します。`AnimationName` 型で補完が効きます。

```tsx
const { ref, play } = useAnimate<HTMLInputElement>();
// 入力が不正なら: play('shake-x');
<input ref={ref} />
```

---

## 2. モーションティア（なめらか ⇄ 最低限）

`prefers-reduced-motion`（アクセシビリティ軸）とは**別の性能軸**として、`<html data-motion>` に
ティアを持たせます。属性を差し替えるだけで、CSS が即座に切り替わります（リロード不要）。

| ティア | 挙動 |
| --- | --- |
| `full`（既定） | アニメーションをフルの長さで再生します。 |
| `minimal` | 入場は `fade-in`、退場は `fade-out` に簡略化し、注意喚起と無限ループは無効、再生時間も短くします。スマートフォンや性能の低い PC 向けです。 |
| `none` | アニメーションを無効にします（即時）。 |

実効レベルは、2 つの軸の弱いほうに合わせます。OS が reduced-motion なら、属性に関わらず最小化されます。

### ランタイム

`MotionProvider`（Vue も同名コンポーネント、WC は `applyMotionLevel()` / `autoMotion()`）が、
端末シグナル（`deviceMemory` / `hardwareConcurrency` / `saveData` / coarse-pointer）と OS 設定から
`auto` を解決し、`data-motion` を設定します。手動上書きと localStorage 永続にも対応します。

```tsx
<MotionProvider defaultPreference="auto">
  <App />
</MotionProvider>;
// 任意の場所で: const { level, setPreference } = useMotionLevel();
```

FOUC 防止には `MotionScript`（Vue/WC は `motionScript()`）を `<head>` に置きます。

---

## 3. presence（enter / exit）

退場アニメーションが終わるまで DOM に要素を残してから取り除く仕組みです。`<Presence>` で包むか、
`usePresence` を直接使います。ティア連動で、`minimal`/`none`/reduced-motion 時は待たず即アンマウントします。

```tsx
<Presence present={open} enter="zoom-in" exit="zoom-out">
  <div className="card">…</div>
</Presence>
```

`Modal` などの主要オーバーレイには最初から組み込まれているので、`open` を渡すだけで enter/exit が付きます。

---

## 4. 効果（飾りのアニメーション）

`.lily-animate` は一度きりの入場・退場に使います。`.lily-fx` は、置いておくと動き続ける
飾りや、カーソルを重ねると反応する飾りです。ベース `.lily-fx` に効果名のモディファイアを
足します。効果は重ねられます。

```html
<h1 class="lily-fx lily-fx--gradient-text">彩</h1>
<article class="lily-fx lily-fx--lift lily-fx--glow">…</article>
```

### カタログ

| 種類 | クラス |
| --- | --- |
| 文字 | `gradient-text`, `shine-text`, `glitch` |
| ホバー | `lift`, `grow`, `glare` |
| 常時 | `float`, `glow`, `shimmer`, `star-border` |
| 背景 | `aurora`, `gradient-bg` |

一覧は Storybook の **Foundations/Effects** で確認できます。

### 速さと色を変える

ループの速さは `--lily-fx-duration` ひとつで決まります。`--lively`（速め）と `--calm`
（ゆっくり）で全体をまとめて変えられます。色は効果ごとのカスタムプロパティで変えます。

| 変数 | 対象 |
| --- | --- |
| `--lily-fx-duration` | すべてのループの速さ |
| `--lily-fx-glow-color` | `glow` の色 |
| `--lily-fx-border-color` / `--lily-fx-border-width` | `star-border` の色・太さ |
| `--lily-fx-shine-base` / `--lily-fx-shine-highlight` | `shine-text` の色 |

### 型付きヘルパー

React / Vue / Web Components から `EFFECT_NAMES`・`effectClass()`・`EffectName` 型を
読み込めます。`effectClass('lift', 'glow')` は `lily-fx lily-fx--lift lily-fx--glow` を返します。

### 動きの強さ・アクセシビリティ

- `data-motion="minimal"` では、常に動く効果（`float` / `glow` / `aurora` など）は止まり、
  カーソルを重ねたときの効果だけ残ります。`none` ではすべて止まります。
- reduced-motion のときは全体リセットがループを止めます。文字は色を保ったまま止まるので読めます。
- 文字の効果のコントラスト（実測）:
  - `shine-text` は地の文の色の範囲で光らせるだけなので、本文でも安全です（最小 10:1）。
  - `glitch` は文字そのものの色は変えず、ずれた影だけを色づけます。色を選んでいるのは作る側なので、本文でも安全です。
  - `gradient-text` は色が大きく変わります。通常の下地（`bg-canvas` / `bg-surface`）では
    AAA を満たしますが、ダークの薄い下地（`bg-subtle`）では 6.7:1 まで下がります。本文で
    確実に 7:1 を保つなら `lily-fx--safe` を併せて指定してください。地の文の色とブランド色の
    間で光らせる組み合わせに替わり、どの下地でも 7:1 以上になります（実測 7.06:1）。

```html
<!-- 大きな見出し向け（鮮やか） -->
<h1 class="lily-fx lily-fx--gradient-text">彩</h1>
<!-- 本文でも安全（7:1 以上） -->
<p class="lily-fx lily-fx--gradient-text lily-fx--safe">読みやすいまま、ほんのり流れます。</p>
```

---

## アクセシビリティ（AAA）

- reduced-motion のときは、全体リセット（`_reset.scss`）が `prefers-reduced-motion` で尺を
  約 0ms に抑えます。`.lily-animate` は `animation-fill-mode: both` なので、入場は表示された
  状態で止まり、要素が消えたまま残ることはありません。
- `flash` などの点滅は閾値（2.3.1）を超えませんが、注意を引くアニメーションは自分で指定した
  ときだけ動くようにしています。
- 無限ループ（`--infinite`）は、`minimal` と reduced-motion では止まります（2.2.2）。多用は
  避けてください。
- 詳しくは [accessibility.md](accessibility.md) を参照してください。
