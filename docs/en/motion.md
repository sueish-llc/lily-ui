<!-- [日本語（正）](../motion.md) | English (translation) -->

# Motion (animation)

Lily's motion layer aims to be **correct just by using it**. Every value is
generated from tokens, the AAA accessibility bar is met, and behavior is the
same across React / Vue / Web Components.

It has three parts:

- Animation utility classes: the `.lily-animate` base plus about 80 `--<name>` classes.
- Motion strength switching: `data-motion` toggles between smooth and minimal.
- Presence: enter / exit animations tied to showing and hiding an element.

---

## 1. Animation utilities

The same two-class model as animate.css: the `.lily-animate` base plus an
animation-name modifier `.lily-animate--<name>`.

```html
<div class="lily-animate lily-animate--fade-in-up">Hello</div>
```

### Catalog (categories)

| Category | Examples |
| --- | --- |
| Entrances | `fade-in`, `fade-in-up`(`-big`), `zoom-in`, `slide-in-left`, `bounce-in`, `flip-in-x`, `back-in-up`, `roll-in`, `light-speed-in-right`, `jack-in-the-box` |
| Exits | `fade-out`, `zoom-out`, `slide-out-down`, `bounce-out`, `flip-out-y`, `back-out-left`, `roll-out`, `light-speed-out-left`, `hinge` |
| Attention | `bounce`, `flash`, `pulse`, `rubber-band`, `shake-x`/`shake-y`, `head-shake`, `swing`, `tada`, `wobble`, `jello`, `heart-beat` |

Play the complete list in Storybook under **Foundations/Animations**.

### Control modifiers (all token-derived)

| Purpose | Classes |
| --- | --- |
| Duration | `--fast`(500ms) / `--base`(800ms) / `--slow`(1200ms) / `--slower`(2000ms) |
| Delay | `--delay-sm` / `--delay-md` / `--delay-lg` / `--delay-xl` |
| Repeat | `--infinite` / `--repeat-2` / `--repeat-3` |
| Easing | `--ease-emphasized` / `--ease-accelerate` |
| UI duration (for overlays) | `--snappy` (`--lily-duration-base` = 200ms) |

```html
<div class="lily-animate lily-animate--pulse lily-animate--infinite">●</div>
```

> Every value is generated from `$animate-duration` / `$animate-delay` in
> `packages/css/src/styles/tokens/_primitives.scss`. There are no magic numbers.

### Typed helpers (React / Vue / Web Components)

To play an animation in response to an event, use `useAnimate` (`animate()` in
WC). Applying the same name again retriggers it, and `will-change` is set only
while the animation runs and removed when it ends. The `AnimationName` type
gives you completion.

```tsx
const { ref, play } = useAnimate<HTMLInputElement>();
// on invalid input: play('shake-x');
<input ref={ref} />
```

---

## 2. Motion tiers (smooth ⇄ minimal)

Separate from `prefers-reduced-motion` (the accessibility axis), `<html
data-motion>` carries a tier on a **performance axis**. Swapping the attribute
switches the CSS instantly (no reload).

| Tier | Behavior |
| --- | --- |
| `full` (default) | Plays animations at full length. |
| `minimal` | Simplifies entrances to `fade-in` and exits to `fade-out`, disables attention and infinite animations, and shortens durations. For phones and low-powered PCs. |
| `none` | Disables animations (instant). |

The effective level follows the weaker of the two axes: if the OS asks for
reduced motion, motion is minimized regardless of the attribute.

### Runtime

`MotionProvider` (a same-named component in Vue; `applyMotionLevel()` /
`autoMotion()` in WC) resolves `auto` from device signals (`deviceMemory` /
`hardwareConcurrency` / `saveData` / coarse pointer) and the OS setting, then
sets `data-motion`. Manual overrides and localStorage persistence are also
supported.

```tsx
<MotionProvider defaultPreference="auto">
  <App />
</MotionProvider>;
// anywhere: const { level, setPreference } = useMotionLevel();
```

To prevent FOUC, put `MotionScript` (`motionScript()` in Vue/WC) in `<head>`.

---

## 3. Presence (enter / exit)

A mechanism that keeps an element in the DOM until its exit animation finishes,
then removes it. Wrap with `<Presence>` or use `usePresence` directly. It is
tier-aware: under `minimal`/`none`/reduced motion it unmounts immediately
without waiting.

```tsx
<Presence present={open} enter="zoom-in" exit="zoom-out">
  <div className="card">…</div>
</Presence>
```

The major overlays such as `Modal` have it built in, so passing `open` is all it
takes to get enter/exit animations.

---

## 4. Effects (decorative animation)

`.lily-animate` is for one-shot entrances and exits. `.lily-fx` is for
decorations that keep moving on their own, or react when the cursor hovers over
them. Add an effect-name modifier to the `.lily-fx` base. Effects can be
stacked.

```html
<h1 class="lily-fx lily-fx--gradient-text">彩</h1>
<article class="lily-fx lily-fx--lift lily-fx--glow">…</article>
```

### Catalog

| Kind | Classes |
| --- | --- |
| Text | `gradient-text`, `shine-text`, `glitch` |
| Hover | `lift`, `grow`, `glare` |
| Ambient | `float`, `glow`, `shimmer`, `star-border` |
| Background | `aurora`, `gradient-bg` |

See the full list in Storybook under **Foundations/Effects**.

### Changing speed and color

Loop speed is governed by a single variable, `--lily-fx-duration`. Use
`--lively` (faster) and `--calm` (slower) to change everything at once. Colors
are changed via per-effect custom properties.

| Variable | Target |
| --- | --- |
| `--lily-fx-duration` | Speed of every loop |
| `--lily-fx-glow-color` | Color of `glow` |
| `--lily-fx-border-color` / `--lily-fx-border-width` | Color / width of `star-border` |
| `--lily-fx-shine-base` / `--lily-fx-shine-highlight` | Colors of `shine-text` |

### Typed helpers

React / Vue / Web Components export `EFFECT_NAMES`, `effectClass()`, and the
`EffectName` type. `effectClass('lift', 'glow')` returns
`lily-fx lily-fx--lift lily-fx--glow`.

### Motion strength & accessibility

- Under `data-motion="minimal"`, always-moving effects (`float` / `glow` /
  `aurora`, etc.) stop; only hover effects remain. Under `none`, everything
  stops.
- With reduced motion, the global reset stops the loops. Text effects stop while
  keeping their colors, so the text stays readable.
- Contrast of the text effects (measured):
  - `shine-text` only shines within the range of the body-text color, so it is
    safe even in body copy (minimum 10:1).
  - `glitch` never changes the text color itself; it only tints the offset
    shadows. The colors are chosen by the author, so it is safe in body copy.
  - `gradient-text` changes color substantially. It meets AAA on the normal
    backgrounds (`bg-canvas` / `bg-surface`), but drops to 6.7:1 on the dark
    theme's subtle background (`bg-subtle`). To reliably keep 7:1 in body copy,
    add `lily-fx--safe`: it switches to a shine between the body-text color and
    the brand color, staying at 7:1 or better on every background (measured
    7.06:1).

```html
<!-- For large headings (vivid) -->
<h1 class="lily-fx lily-fx--gradient-text">彩</h1>
<!-- Safe in body copy (7:1 or better) -->
<p class="lily-fx lily-fx--gradient-text lily-fx--safe">Stays readable, with a gentle flow.</p>
```

---

## Accessibility (AAA)

- With reduced motion, the global reset (`_reset.scss`) caps durations at about
  0ms under `prefers-reduced-motion`. `.lily-animate` uses
  `animation-fill-mode: both`, so entrances settle in the visible state and an
  element never stays stuck hidden.
- Flashing such as `flash` stays below the threshold (2.3.1), and
  attention-seeking animations only run when you opt in.
- Infinite loops (`--infinite`) stop under `minimal` and reduced motion (2.2.2).
  Avoid overusing them.
- See [accessibility.md](accessibility.md) for details.
