# AI-friendly usage guide

Lily UI is designed so that **AI agents can generate correct code from
convention alone**. The rules below are intentionally uniform and predictable —
learn them once and every component follows them.

## Why it's AI-friendly

1. **One naming system, no exceptions.** Same prop names, same class scheme,
   same file layout everywhere → an agent can pattern-match instead of guess.
2. **Typed enums, not free strings.** Props like `status` are string unions, so
   editor/agent completion produces only valid values.
3. **Tokens, not magic numbers.** Every color/space/radius is a named token, so
   there's a single right answer for "what value do I use?".
4. **Self-documenting examples.** Every component ships a `.stories.tsx` that
   doubles as a usage example.

## Component API contract

Every component:

- is a named export plus a `…Props` type export (`import { Button } from '@lily-ui/react'`);
- uses `forwardRef` and forwards unknown props (`...rest`) to its root element;
- renders class names only (styling is in `@lily-ui/css`).

### Shared props (same meaning everywhere)

| Prop        | Type                                                                     | Default | Meaning                                                          |
| ----------- | ------------------------------------------------------------------------ | ------- | ---------------------------------------------------------------- |
| `status`    | `'primary' \| 'danger' \| 'warning' \| 'success' \| 'info' \| 'neutral'` | varies  | Semantic color/intent.                                           |
| `size`      | `'sm' \| 'md' \| 'lg'`                                                   | `'md'`  | Control size (maps to `--lily-control-h-*`).                     |
| `variant`   | component-specific                                                       | varies  | Visual emphasis, e.g. Button: `'solid' \| 'outline' \| 'ghost'`. |
| `block`     | `boolean`                                                                | `false` | Stretch to fill container width.                                 |
| `className` | `string`                                                                 | —       | Merged after library classes.                                    |

### Class-name scheme (BEM-ish)

```
.lily-<component>             // root
.lily-<component>--<modifier> // variant / status / size / state
.lily-<component>__<part>     // sub-element
```

Example: `lily-button lily-button--solid lily-button--md` — the `status` prop is
reflected as `data-status="primary"` rather than a class, and styles select on it.

## Minimal example

```tsx
import '@lily-ui/css/styles';
import { ThemeProvider, Button } from '@lily-ui/react';

export function App() {
  return (
    <ThemeProvider defaultMode="system">
      <Button status="primary" size="lg">
        保存する
      </Button>
    </ThemeProvider>
  );
}
```

## Tokens cheat-sheet (use these, not raw values)

| Need                           | Token (CSS var)                                                  |
| ------------------------------ | ---------------------------------------------------------------- |
| Brand action color             | `--lily-color-primary` (`-hover` / `-active` / `-subtle`)        |
| Accent / emphasis (彩)         | `--lily-color-accent` (藤 fuji / wisteria)                       |
| Signature gradient             | `--lily-color-accent-gradient`, `--lily-color-primary-gradient`  |
| Text                           | `--lily-color-fg-default` / `-muted` / `-subtle`                 |
| Colored text / links (AAA 7:1) | `--lily-color-{primary,accent,danger,warning,success,info}-text` |
| Surfaces                       | `--lily-color-bg-canvas` / `-surface` / `-subtle`                |
| Status                         | `--lily-color-{danger,warning,success,info}`                     |
| Spacing (4px grid)             | `--lily-space-{0..24}`                                           |
| Radius                         | `--lily-radius-{sm,md,lg,xl,2xl,pill}`                           |
| Shadow                         | `--lily-shadow-{sm,md,lg,xl}`                                    |
| Text size                      | `--lily-text-{xs..5xl}`                                          |
| Line height                    | `--lily-leading-{tight,snug,normal,relaxed,ja,loose}`            |

In SCSS reference them via `fn.var-ref('color-primary')`.

## Theming & density

```html
<html data-theme="dark">
  <!-- light | dark | (omit = follow OS) -->
  <body data-density="compact">
    <!-- comfortable (default) | compact -->
  </body>
</html>
```

## Do / Don't for generated code

- ✅ Use shared prop names (`status`, `size`, `variant`, `block`).
- ✅ Reference semantic tokens for all visual values.
- ✅ Support light **and** dark; respect reduced motion.
- ❌ Don't inline styles or hard-code hex/px in React.
- ❌ Don't invent new prop names for existing concepts.
- ❌ Don't reach into raw palette steps from components. The ramps are exposed
  as `--lily-color-{role}-{step}` (e.g. `--lily-color-primary-100`) for tooling
  and one-off adjustments only — components use the semantic `--lily-color-*`
  tokens so theming keeps working.

See also: [design-language.md](docs/design-language.md) (the 彩 worldview),
[architecture.md](docs/architecture.md) (token pipeline), [tokens.md](docs/tokens.md),
[framework-ports.md](docs/framework-ports.md) (Vue & Web Components parity).

## Date & time: always use the Temporal API (required)

Date/time handling is a **core tenet** of this library. Whenever a component or
helper deals with dates, times, or datetimes, it **must** use the standard
**Temporal API** — never the legacy `Date` object, ad-hoc strings like
`"HH:MM"`, or manual number math for calendar/clock values.

- **Component values are Temporal types**, not strings:
  - dates → `Temporal.PlainDate` (DatePicker, Calendar, DateRangePicker);
  - times → `Temporal.PlainTime` (TimePicker);
  - date+time → `Temporal.PlainDateTime`; zoned → `Temporal.ZonedDateTime`.
  So `value` / `defaultValue` / `onChange` are typed with the Temporal type
  (e.g. `value?: Temporal.PlainTime | null`), and arithmetic uses Temporal
  methods (`.add`, `.subtract`, `.with`, `Temporal.PlainDate.compare`, …).
- **Parse/format via Temporal**: build from input with `Temporal.PlainX.from(...)`
  and format through `Intl.DateTimeFormat` (see the helpers in
  `packages/*/src/utils/datetime.ts`: `toPlainDate`, `today`, `addDays`,
  `diffInDays`, `isToday`, `formatDate`). Add Temporal-based helpers there rather
  than reaching for `new Date()`.
- ❌ **No `Date`, no string time math.** Don't model a time as `"09:30"` + parse
  with `split(':')`, and don't compute day grids with millisecond offsets. Use
  `Temporal.PlainTime` / `Temporal.PlainDate` and their methods.
- **Web Components boundary:** attributes/events are strings (e.g. a `value`
  attribute of `"09:30"` or an ISO date), but the element must **parse them into
  Temporal values internally** (`Temporal.PlainTime.from(attr)`) and compose with
  Temporal before emitting. The string only exists at the attribute/DOM edge.
- Temporal is a global on Node 26 (the target); other runtimes load
  `temporal-polyfill` (tests do this in `src/test/setup.ts`). The ambient types
  live in each package's `temporal.d.ts`.

## Storybook: group stories by component, not by batch (required)

Every component ships **one `*.stories.tsx` co-located in its folder**, with a
content-based `title` of the form `'<Category>/<Component>'` so the sidebar is
organized by what the component *is*. Categories in use:

`Foundations` · `Layout` · `Typography` · `Actions` · `Data Display` · `Media` ·
`Forms` · `Navigation` · `Disclosure` · `Feedback` · `Overlay`.

- ✅ `title: 'Forms/Time Picker'`, `title: 'Data Display/Avatar'` — one component
  per story file, `component:` set, `tags: ['autodocs']`.
- ❌ Don't group several unrelated components into one story file, and **don't
  title stories by work batch / wave** (e.g. `'Forms/Wave 7a'`). The sidebar
  should read as a component catalog.

## Framework parity: add every component to all three packages (required)

Lily ships the same component set for **three** runtimes that emit identical
markup/classes:

- `@lily-ui/react` (`packages/react`) — **the source of truth**;
- `@lily-ui/vue` (`packages/vue`);
- `@lily-ui/web-components` (`packages/web-components`).

**A component is not "added" until it exists in all three.** When you add, rename,
or remove a component (or change its props/variants/markup), you must make the
matching change in **React, Vue, and Web Components together**, in the same
change set — never land one package alone. Each new component also updates that
package's public surface:

- React: `packages/react/src/index.ts`;
- Vue: `packages/vue/src/index.ts`;
- Web Components: `packages/web-components/src/index.ts` **and** the registry in
  `packages/web-components/src/elements.ts` (the `[tag-name, ctor]` entry).

Follow [framework-ports.md](docs/framework-ports.md) for the per-framework
authoring conventions, and keep DOM, class names, ARIA, and keyboard behavior
identical to the React source of truth.

**Before committing, confirm parity.** Verify the component is present in all
three packages and exported from each entry point — e.g. for a component named
`Foo` (tag `lily-foo`):

```bash
ls packages/react/src/components/Foo \
   packages/vue/src/components/Foo \
   packages/web-components/src/components/Foo.ts
grep -R "Foo" packages/react/src/index.ts packages/vue/src/index.ts \
   packages/web-components/src/index.ts packages/web-components/src/elements.ts
```

`pnpm build` + `pnpm typecheck` (below) must pass for **all three** packages.

## Before pushing: run the CI checks locally (required)

**Never push without reproducing CI locally first.** These are the checks CI
runs; they must all pass before you commit & push:

```bash
pnpm install --frozen-lockfile   # lockfile must be in sync
pnpm lint                        # eslint + stylelint
pnpm build                       # every package builds (incl. .d.ts emit)
pnpm typecheck                   # react (tsc), vue + storybook (vue-tsc), web-components (tsc)
pnpm test                        # unit + a11y (vitest-axe)
```

**Match CI's clean state.** CI does **not** build before `typecheck` / `test`,
so a stale local `dist/` can mask real failures (e.g. unresolved `@lily-ui/*`
types). Always re-verify from a clean state:

```bash
rm -rf packages/*/dist && pnpm typecheck && pnpm test
```

If a check only passes after a build, fix the build-order dependency (e.g.
resolve workspace packages from source via tsconfig `paths`) rather than relying
on a pre-existing `dist/`.

**Always read the actual CI failure output — never infer from the job name or
status alone (required).** A red check is not explained by its label. Open the
failing job's logs and read the real error before deciding what (if any) action
to take. In particular:

- Do **not** dismiss a failure as "environmental", "expected", "flaky", or
  "pre-existing" without first reading the log lines that prove it. Job names
  like `(Node 26 pending)` or `continue-on-error: true` describe intent, **not**
  the cause of a given failure — the same job can fail for a real, code-level
  reason (e.g. a test that throws), and that must be fixed.
- The local environment can differ from CI (Node version, jsdom globals such as
  `window.localStorage`/`matchMedia`, native vs. polyfilled Temporal). A green
  local run does **not** prove CI is green. When a test only fails on CI,
  reproduce the CI condition (e.g. stub the missing global) and make the code
  robust to it, rather than assuming the environment is at fault.
- Guard browser-only globals (`localStorage`, `matchMedia`, `navigator.*`)
  before use so SSR and minimal test runtimes don't throw.

## Accessibility: WCAG 2.1 AAA (required — always verify)

This project targets **WCAG 2.1 AAA**, not AA. Every change must preserve it —
verify, don't assume:

- **Contrast (1.4.6 enhanced):** text ≥ **7:1** (large text ≥ 4.5:1; non-text /
  UI boundaries ≥ 3:1) in **both** light and dark themes — including text on
  solid fills (buttons, badges, alerts), which must clear 7:1 in the default
  state. When touching any color token, **compute the ratio** for every affected
  text/background pair before and after; don't eyeball it. Storybook's a11y panel
  runs axe's `color-contrast-enhanced` (7:1) rule and must stay green.
- **No color-only meaning (1.4.1):** convey state with text/icons too.
- **Keyboard, no exception (2.1.1 / 2.1.3):** every interaction works by
  keyboard; preserve the documented key models (Tabs, Accordion, Dropdown,
  DatePicker, Modal, …).
- **Focus visible (2.4.7):** keep the `:focus-visible` ring; never remove it
  without an equal-or-better replacement.
- **No time limits on reading (2.2.x):** don't auto-dismiss content by default
  (Toast is persistent by default); auto-advancing UI (Carousel) stays opt-in
  and pausable.
- **Reduced motion (2.3.3):** respect `prefers-reduced-motion`.
- **Run the a11y tests:** `pnpm test:a11y` (vitest-axe) must pass, and every new
  component ships a `*.a11y.test.tsx`.

See [accessibility.md](docs/accessibility.md) for the full AAA contract.

## 日本語のユーザー向け文言：自然な日本語で書く（必須）

画面に出るテキスト（Storybook の説明・ラベル・ボタン、コンポーネントの文言、`docs/`
の本文など、利用者の目に触れる日本語すべて）は、ネイティブが読んで引っかからない自然な
日本語で書きます。AI が書いたような不自然さ（いわゆる AI 臭）を残してはいけません。判断
基準は [humanizer-ja](https://github.com/gonta223/humanizer-ja) と、[この記事](https://note.com/ikora/n/n0bbb2828b91e)
（AI 臭の正体を表層だけでなく踏み込んで整理したもの）に準拠します。

### 形式の癖（指紋として出やすい）

- 全角ダッシュ「──」「—」、em-dash「——」を多用しない。
- 意味のないカギ括弧をやめる。「」は固有名詞・特別な言い回し・強調だけに使う。
  普通の形容詞や心情を「軽い」「ちゃんと」のように囲まない。
- 真面目な文書に絵文字（🚀🎯✨💡 など）を散らさない。
- 太字＋コロンの箇条書き（「**速度:** 高速化」のような型）にしない。

### 中身の癖（ここがいちばん臭う）

- 見出しを主張にしない。「プロダクトは余白を失った瞬間に死ぬ」ではなく「プロダクト作りの話」
  のように、内容を表す素直な見出しにする。
- AI が好む語を盛らない。手触り・泥臭さ・血の通った・解像度・腹落ち・本質・等身大・営み・
  ○○の思想／哲学、といった語をいくつも重ねない。
- システム用語のメタファーを乱用しない。「思考の OS をアップデート」「人生をハック」
  「習慣をインストール」ではなく、「考え方を変える」「工夫する」「習慣をつける」と書く。
- 必殺技めいた造語で話を大げさにしない。小さな体験を真理・境地・虚飾・禁欲的、のような
  大きな名詞でくくらない。
- 「A ではなく、B だ」式の反転や、「A でも B でもなく C」式の否定の列挙で飾らない。
  言いたいこと（B や C）をそのまま書く。
- 副詞を重ねて熱量を演出しない（めっちゃ・ガチで・普通に・かなり・マジで）。
- カタカナ語を日本語に置き換えられるなら置き換える（コンテキスト→文脈、アライメントを取る→
  揃える、コミュニケーションを取る→話す）。英語の固有名詞を毎回律儀に正式名称で書かない。

### 書き手を消さない

- 一般論で薄めない。「多くのエンジニアが悩んでいる」ではなく、必要なら具体や一人称で書く。
- 体験を出したらすぐ教訓に変換しない。
- 直接知らない事実は伝聞のまま書く（「〜らしい」「〜だそう」）。Wikipedia 風の断定で固めない。
- 無害化しない。やめるべきものは「やめたほうがいい」とはっきり書く。両論併記や
  「ケースバイケース」「場合によります」で結論から逃げない。各節の末尾に
  「あくまで個人の経験です」のような断りを貼って回らない。
- 文末を単調にしない（「します。」の連続を避ける）。段落の長さにも緩急をつける。

### 進め方（必須）

- 書く前に「何が言いたいか」を決めてから書く。
- 確定前に通して読み返す。声に出すか頭の中で読むと、リズムの崩れや不自然さに気づける。
- **利用者向けの日本語を書いた・変えたら、コミット前に必ず別のエージェント**
  （例: `general-purpose`）へ上の基準で校正を依頼し、指摘を反映する。自分一人の判断で
  確定させないこと。
