<!-- [日本語（正）](../roadmap.md) | English (translation) -->

# Component list and what's next

This is the set of components Lily UI ships today. Every component has the same
markup, class names, and ARIA across the three packages (React / Vue /
Web Components), and comes with a CSS partial (semantic tokens only), Storybook
stories, behavior tests, and vitest-axe a11y tests. Browse the working catalog in
Storybook and on the docs site.

## Layout

Affix / Container / Divider / Footer / Grid (Row & Col, responsive 12-column) /
Ratio / ScrollArea / Splitter / Stack / VisuallyHidden

## Typography

CodeBlock / Kbd & Code / Link / Mark / Text & Heading

## Actions

Button / ButtonGroup / CloseButton / CopyButton / FloatButton / Toolbar

## Forms

Calendar / Cascader / Checkbox / ColorPicker / Combobox / DatePicker /
DateRangePicker / DateTimePicker / DurationInput / Fieldset / FileUpload /
FloatingLabel / FormField / Input / InputGroup / MonthPicker / NumberInput /
PinInput / Radio / Range / RangeDual / Rating / SegmentedControl / Select /
Switch / TagInput / Textarea / TimePicker / TimeZoneSelect / Transfer /
TreeSelect

The date & time components (Calendar, DatePicker, DateRangePicker,
DateTimePicker, MonthPicker, TimePicker, DurationInput, TimeZoneSelect) use the
Temporal API for their value types. See the Date & time section of
[CLAUDE.md](../../CLAUDE.md) for details.

## Navigation

BackTop / Breadcrumb / Menu / Navbar / Pagination / Stepper / Tabs / Tree

Highlighting nav items by scroll position is provided as functions rather than
components (`useScrollspy` in React and Vue, `createScrollspy` in Web
Components).

## Data display

Avatar & AvatarGroup / Badge / Card / Chip / Countdown / Descriptions /
ListGroup / RelativeTime / Stat / Table / Timeline

## Media

Carousel / Icon / Image / Watermark

## Disclosure

Accordion / Collapse / Presence

## Feedback

Alert / EmptyState / Meter / Progress / Result / Skeleton / Spinner / Toast

## Overlay

AlertDialog / CommandPalette / ContextMenu / Drawer / Dropdown / HoverCard /
Modal / Offcanvas / Popover / Tooltip

## Styling foundations

- Design tokens (color, spacing, type, radius, shadow, motion, z-index, breakpoints)
- Theming (light / dark / system, custom themes, per-user overrides via ThemeOverride)
- Utility classes (spacing, layout, flex, type, color, a11y)
- Reset and base styles, LINE Seed typography (opt-in)
- Motion layer ([motion.md](motion.md))
- Shared hooks (useControllableState, focus trap, dismiss, scroll lock)

## What's next

The styling layer still has room to grow. Planned:

- Typography role presets (display / title / body / label / caption)
- State-layer tokens (overlay opacities for hover / active / selected)
- An opacity scale (`--lily-opacity-*`)
- backdrop-blur tokens (frosted-glass surfaces)
- A border-width scale
- Focus-ring offset tokens
- Elevated surfaces (the `bg-elevated` family)
- Container-query-aware utilities

## Every component must

1. Be keyboard operable and screen-reader labeled.
2. Pass `*.a11y.test.tsx` (vitest-axe) and the Storybook a11y addon.
3. Use only semantic CSS-variable tokens; no inline magic numbers.
4. Ship JSDoc and a `*.stories.tsx` with autodocs.
5. Support `ref` forwarding and, where sensible, the polymorphic `as` prop.
6. Exist in all three packages (React / Vue / Web Components) with the same
   DOM, class names, and keyboard behavior.
