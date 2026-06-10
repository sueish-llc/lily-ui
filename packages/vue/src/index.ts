/**
 * @lily-ui/vue — public API.
 *
 * Pair with the CSS layer (import once at your app entry):
 * ```ts
 * import '@lily-ui/css/styles';
 * ```
 *
 * @packageDocumentation
 */

// Theming
export { default as ThemeProvider } from './components/ThemeProvider/ThemeProvider.vue';
export {
  provideTheme,
  useTheme,
  themeScript,
  type ThemeMode,
  type ResolvedTheme,
  type ThemeContext,
  type ProvideThemeOptions,
} from './composables/theme';
export { default as ThemeOverride } from './components/ThemeOverride/ThemeOverride.vue';
export {
  buildThemeOverrideCss,
  contrastRatio,
  findContrastIssues,
  AAA_TEXT_CONTRAST,
  THEME_OVERRIDE_ATTR,
  type ColorTokenName,
  type ThemeColorOverrides,
  type ThemeOverrideInput,
  type ContrastIssue,
} from './utils/themeOverride';

// Motion
export { default as MotionProvider } from './components/MotionProvider/MotionProvider.vue';
export { default as Presence } from './components/Presence/Presence.vue';
export {
  provideMotion,
  useMotionLevel,
  motionScript,
  prefersReducedMotion,
  detectMotionLevel,
  resolveMotionLevel,
  type MotionLevel,
  type MotionPreference,
  type MotionContext,
  type ProvideMotionOptions,
} from './composables/motion';
export { usePresence, type PresenceState, type UsePresenceResult } from './composables/presence';
export { useAnimate, type UseAnimateResult } from './composables/animate';
export {
  ANIMATION_NAMES,
  ATTENTION_ANIMATIONS,
  ENTRANCE_ANIMATIONS,
  EXIT_ANIMATIONS,
  animationClass,
  type AnimationName,
  type AttentionAnimation,
  type EntranceAnimation,
  type ExitAnimation,
} from './composables/animations';
export {
  AMBIENT_EFFECTS,
  BACKGROUND_EFFECTS,
  EFFECT_NAMES,
  EFFECT_TEMPOS,
  HOVER_EFFECTS,
  TEXT_EFFECTS,
  effectClass,
  type AmbientEffect,
  type BackgroundEffect,
  type EffectName,
  type EffectTempo,
  type HoverEffect,
  type TextEffect,
} from './composables/effects';

// Field context (for building custom controls)
export {
  provideField,
  useField,
  useFieldControl,
  type FieldContext,
  type FieldControlProps,
} from './composables/field';

// Interaction composables
export {
  useScrollLock,
  useFocusTrap,
  useDismiss,
  type DismissOptions,
} from './composables/interactions';

// Scrollspy
export { useScrollspy, type UseScrollspyOptions } from './composables/scrollspy';

// Toast API
export { default as ToastProvider } from './components/ToastProvider/ToastProvider.vue';
export {
  provideToast,
  useToast,
  type ToastStatus,
  type ToastPlacement,
  type ToastOptions,
} from './composables/toast';

// Utilities
export { cx, type ClassValue } from './utils/cx';
export {
  toPlainDate,
  today,
  addDays,
  diffInDays,
  isToday,
  formatDate,
  type PlainDateInput,
} from './utils/datetime';

// --- Components ------------------------------------------------------------

// Actions
export { default as Button } from './components/Button/Button.vue';
export type { ButtonVariant, ButtonStatus, ButtonSize } from './components/Button/Button.vue';
export { default as ButtonGroup } from './components/ButtonGroup/ButtonGroup.vue';
export { default as CloseButton } from './components/CloseButton/CloseButton.vue';
export { default as CopyButton } from './components/CopyButton/CopyButton.vue';

// Layout
export { default as Container } from './components/Container/Container.vue';
export type { ContainerWidth } from './components/Container/Container.vue';
export { default as Stack } from './components/Stack/Stack.vue';
export { default as Row } from './components/Grid/Row.vue';
export { default as Col } from './components/Grid/Col.vue';
export type { ColSpan, ColResponsive } from './components/Grid/Col.vue';
export { default as Ratio } from './components/Ratio/Ratio.vue';
export type { NamedRatio, RatioValue } from './components/Ratio/Ratio.vue';

// Data display
export { default as Badge } from './components/Badge/Badge.vue';
export type { BadgeStatus } from './components/Badge/Badge.vue';
export { default as Spinner } from './components/Spinner/Spinner.vue';
export type { SpinnerVariant, SpinnerSize } from './components/Spinner/Spinner.vue';
export { default as Progress } from './components/Progress/Progress.vue';
export { default as Table } from './components/Table/Table.vue';
export { default as Card } from './components/Card/Card.vue';
export { default as CardHeader } from './components/Card/CardHeader.vue';
export { default as CardBody } from './components/Card/CardBody.vue';
export { default as CardFooter } from './components/Card/CardFooter.vue';
export { default as CardTitle } from './components/Card/CardTitle.vue';
export { default as ListGroup } from './components/ListGroup/ListGroup.vue';
export { default as ListGroupItem } from './components/ListGroup/ListGroupItem.vue';

// Feedback
export { default as Alert } from './components/Alert/Alert.vue';
export type { AlertStatus } from './components/Alert/Alert.vue';

// Navigation
export { default as Breadcrumb } from './components/Breadcrumb/Breadcrumb.vue';
export type { BreadcrumbItem } from './components/Breadcrumb/Breadcrumb.vue';
export { default as Pagination } from './components/Pagination/Pagination.vue';
export { default as Navbar } from './components/Navbar/Navbar.vue';
export { default as Footer } from './components/Footer/Footer.vue';
export { default as Tabs } from './components/Tabs/Tabs.vue';
export type { TabItem } from './components/Tabs/Tabs.vue';

// Forms
export { default as FormField } from './components/FormField/FormField.vue';
export { default as Input } from './components/Input/Input.vue';
export { default as Textarea } from './components/Textarea/Textarea.vue';
export { default as Select } from './components/Select/Select.vue';
export { default as Checkbox } from './components/Checkbox/Checkbox.vue';
export { default as Radio } from './components/Radio/Radio.vue';
export { default as Switch } from './components/Switch/Switch.vue';
export { default as Range } from './components/Range/Range.vue';
export { default as InputGroup } from './components/InputGroup/InputGroup.vue';
export { default as InputGroupAddon } from './components/InputGroup/InputGroupAddon.vue';
export { default as FloatingLabel } from './components/FloatingLabel/FloatingLabel.vue';
export { default as DatePicker } from './components/DatePicker/DatePicker.vue';
export type { Weekday } from './components/DatePicker/DatePicker.vue';

// Disclosure
export { default as Collapse } from './components/Collapse/Collapse.vue';
export { default as Accordion } from './components/Accordion/Accordion.vue';
export type { AccordionItem } from './components/Accordion/Accordion.vue';

// Overlays
export { default as Dropdown } from './components/Dropdown/Dropdown.vue';
export { default as DropdownItem } from './components/Dropdown/DropdownItem.vue';
export { default as DropdownDivider } from './components/Dropdown/DropdownDivider.vue';
export { default as Tooltip } from './components/Tooltip/Tooltip.vue';
export { default as Popover } from './components/Popover/Popover.vue';
export { default as Modal } from './components/Modal/Modal.vue';
export type { ModalSize } from './components/Modal/Modal.vue';
export { default as Offcanvas } from './components/Offcanvas/Offcanvas.vue';
export type { OffcanvasPlacement } from './components/Offcanvas/Offcanvas.vue';
export { default as Drawer } from './components/Drawer/Drawer.vue';
export type { DrawerVariant, DrawerAnchor } from './components/Drawer/Drawer.vue';
export { default as Carousel } from './components/Carousel/Carousel.vue';

// --- Primitives ------------------------------------------------------------
export { default as Text } from './components/Typography/Text.vue';
export type { TextVariant, TextTone } from './components/Typography/Text.vue';
export { default as Heading } from './components/Typography/Heading.vue';
export type { HeadingLevel } from './components/Typography/Heading.vue';
export { default as Link } from './components/Link/Link.vue';
export type { LinkStatus } from './components/Link/Link.vue';
export { default as Icon } from './components/Icon/Icon.vue';
export type { IconSize, IconTone } from './components/Icon/Icon.vue';
export { default as Avatar } from './components/Avatar/Avatar.vue';
export type { AvatarSize, AvatarStatus } from './components/Avatar/Avatar.vue';
export { default as AvatarGroup } from './components/Avatar/AvatarGroup.vue';
export { default as Divider } from './components/Divider/Divider.vue';
export type { DividerOrientation } from './components/Divider/Divider.vue';
export { default as Chip } from './components/Chip/Chip.vue';
export type { ChipStatus } from './components/Chip/Chip.vue';
export { default as Kbd } from './components/Kbd/Kbd.vue';
export { default as Code } from './components/Kbd/Code.vue';

// --- Forms -----------------------------------------------------------------
export { default as SegmentedControl } from './components/SegmentedControl/SegmentedControl.vue';
export type { SegmentedOption } from './components/SegmentedControl/SegmentedControl.vue';
export { default as NumberInput } from './components/NumberInput/NumberInput.vue';
export { default as Rating } from './components/Rating/Rating.vue';
export { default as PinInput } from './components/PinInput/PinInput.vue';
export { default as TagInput } from './components/TagInput/TagInput.vue';
export { default as FileUpload, formatBytes } from './components/FileUpload/FileUpload.vue';
export { default as RangeDual } from './components/RangeDual/RangeDual.vue';
export { default as Combobox } from './components/Combobox/Combobox.vue';
export type { ComboboxOption } from './components/Combobox/Combobox.vue';
export { default as TimePicker } from './components/TimePicker/TimePicker.vue';
export { default as DateRangePicker } from './components/DateRangePicker/DateRangePicker.vue';
export type { DateRange } from './components/DateRangePicker/DateRangePicker.vue';

// --- Navigation & feedback --------------------------------------------------
export { default as Stepper } from './components/Stepper/Stepper.vue';
export type { StepItem, StepStatus } from './components/Stepper/Stepper.vue';
export { default as EmptyState } from './components/EmptyState/EmptyState.vue';
export { default as Stat } from './components/Stat/Stat.vue';
export type { StatTrend } from './components/Stat/Stat.vue';
export { default as Timeline } from './components/Timeline/Timeline.vue';
export type { TimelineItem, TimelineStatus } from './components/Timeline/Timeline.vue';
export { default as Skeleton } from './components/Skeleton/Skeleton.vue';
export type { SkeletonVariant } from './components/Skeleton/Skeleton.vue';
export { default as Meter } from './components/Meter/Meter.vue';
export type { MeterStatus } from './components/Meter/Meter.vue';
export { default as Menu } from './components/Menu/Menu.vue';
export type { MenuItemDef } from './components/Menu/Menu.vue';
export { default as BackTop } from './components/BackTop/BackTop.vue';
export { default as Affix } from './components/Affix/Affix.vue';

// --- Rich UX ---------------------------------------------------------------
export { default as ScrollArea } from './components/ScrollArea/ScrollArea.vue';
export { default as Image } from './components/Image/Image.vue';
export { default as Splitter } from './components/Splitter/Splitter.vue';
export { default as Tree } from './components/Tree/Tree.vue';
export type { TreeNode } from './components/Tree/Tree.vue';
export { default as Calendar } from './components/Calendar/Calendar.vue';
export { default as Transfer } from './components/Transfer/Transfer.vue';
export type { TransferItem } from './components/Transfer/Transfer.vue';
export { default as ColorPicker, DEFAULT_SWATCHES } from './components/ColorPicker/ColorPicker.vue';
export { default as Cascader } from './components/Cascader/Cascader.vue';
export type { CascaderOption } from './components/Cascader/Cascader.vue';
export { default as CommandPalette } from './components/CommandPalette/CommandPalette.vue';
export type { CommandItem } from './components/CommandPalette/CommandPalette.vue';

// --- Date & time, a11y, overlays, more ---------------------------------------------------
export { default as DateTimePicker } from './components/DateTimePicker/DateTimePicker.vue';
export { default as MonthPicker } from './components/MonthPicker/MonthPicker.vue';
export { default as TimeZoneSelect } from './components/TimeZoneSelect/TimeZoneSelect.vue';
export { default as RelativeTime } from './components/RelativeTime/RelativeTime.vue';
export { default as Countdown } from './components/Countdown/Countdown.vue';
export { default as DurationInput } from './components/DurationInput/DurationInput.vue';
export { default as VisuallyHidden } from './components/VisuallyHidden/VisuallyHidden.vue';
export { default as AlertDialog } from './components/AlertDialog/AlertDialog.vue';
export { default as Toolbar } from './components/Toolbar/Toolbar.vue';
export { default as Fieldset } from './components/Fieldset/Fieldset.vue';
export { default as HoverCard } from './components/HoverCard/HoverCard.vue';
export { default as ContextMenu } from './components/ContextMenu/ContextMenu.vue';
export { default as ContextMenuItem } from './components/ContextMenu/ContextMenuItem.vue';
export { default as ContextMenuDivider } from './components/ContextMenu/ContextMenuDivider.vue';
export { default as Descriptions } from './components/Descriptions/Descriptions.vue';
export { default as DescriptionsItem } from './components/Descriptions/DescriptionsItem.vue';
export { default as Result } from './components/Result/Result.vue';
export { default as FloatButton } from './components/FloatButton/FloatButton.vue';
export { default as FloatButtonGroup } from './components/FloatButton/FloatButtonGroup.vue';
export { default as CodeBlock } from './components/CodeBlock/CodeBlock.vue';
export { default as Mark } from './components/Mark/Mark.vue';
export { default as TreeSelect } from './components/TreeSelect/TreeSelect.vue';
export { default as Watermark } from './components/Watermark/Watermark.vue';
