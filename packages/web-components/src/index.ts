/**
 * @lily-ui/web-components — public API.
 *
 * Pair with the CSS layer (import once at your app entry):
 * ```ts
 * import '@lily-ui/css/styles';
 * import '@lily-ui/web-components/define'; // register <lily-*> elements
 * ```
 *
 * Or register manually:
 * ```ts
 * import { defineLilyElements } from '@lily-ui/web-components';
 * defineLilyElements();
 * ```
 *
 * @packageDocumentation
 */

// Registration
export { defineLilyElements, elements } from './elements';

// Base + helpers (for building custom Lily elements)
export { LilyElement, h, define, uid, FORM_CONTROL_ATTRS, type BuildResult } from './base/LilyElement';
export { lockScroll, trapFocus, listenDismiss, type DismissOptions } from './base/interactions';

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
export { createScrollspy, type ScrollspyOptions } from './utils/scrollspy';

// Theming
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
export {
  MOTION_ATTR,
  applyMotionLevel,
  autoMotion,
  motionScript,
  prefersReducedMotion,
  detectMotionLevel,
  resolveMotionLevel,
  shouldSkipMotion,
  type MotionLevel,
  type MotionPreference,
} from './utils/motion';
export { animate } from './utils/animate';
export { enter, exit } from './base/presence';
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
} from './utils/animations';
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
} from './utils/effects';

// Toast imperative API
export {
  LilyToastRegion,
  toast,
  dismissToast,
  type ToastStatus,
  type ToastPlacement,
  type ToastOptions,
} from './components/Toast';

// --- Element classes + types ----------------------------------------------

// Actions
export { LilyButton, type ButtonVariant, type ButtonStatus, type ButtonSize } from './components/Button';
export { LilyButtonGroup } from './components/ButtonGroup';
export { LilyCloseButton } from './components/CloseButton';
export { LilyCopyButton } from './components/CopyButton';

// Layout
export { LilyContainer } from './components/Container';
export { LilyStack } from './components/Stack';
export { LilyRow } from './components/Row';
export { LilyCol, type ColSpan } from './components/Col';
export { LilyRatio, type NamedRatio } from './components/Ratio';

// Data display
export { LilyBadge, type BadgeStatus } from './components/Badge';
export { LilySpinner, type SpinnerVariant, type SpinnerSize } from './components/Spinner';
export { LilyProgress } from './components/Progress';
export { LilyTable } from './components/Table';
export {
  LilyCard,
  LilyCardHeader,
  LilyCardBody,
  LilyCardFooter,
  LilyCardTitle,
} from './components/Card';
export { LilyListGroup, LilyListGroupItem } from './components/ListGroup';

// Feedback
export { LilyAlert, type AlertStatus } from './components/Alert';

// Navigation
export { LilyBreadcrumb, type BreadcrumbItem } from './components/Breadcrumb';
export { LilyPagination } from './components/Pagination';
export { LilyNavbar } from './components/Navbar';
export { LilyFooter } from './components/Footer';
export { LilyTabs, type TabItem } from './components/Tabs';

// Forms
export { LilyFormField } from './components/FormField';
export { LilyInput } from './components/Input';
export { LilyTextarea } from './components/Textarea';
export { LilySelect } from './components/Select';
export { LilyCheckbox } from './components/Checkbox';
export { LilyRadio } from './components/Radio';
export { LilySwitch } from './components/Switch';
export { LilyRange } from './components/Range';
export { LilyInputGroup, LilyInputGroupAddon } from './components/InputGroup';
export { LilyFloatingLabel } from './components/FloatingLabel';
export { LilyDatePicker, type Weekday } from './components/DatePicker';

// Disclosure
export { LilyCollapse } from './components/Collapse';
export { LilyAccordion, type AccordionItem } from './components/Accordion';

// Overlays
export { LilyDropdown, LilyDropdownItem, LilyDropdownDivider } from './components/Dropdown';
export { LilyTooltip } from './components/Tooltip';
export { LilyPopover } from './components/Popover';
export { LilyModal, type ModalSize } from './components/Modal';
export { LilyOffcanvas, type OffcanvasPlacement } from './components/Offcanvas';
export { LilyDrawer, type DrawerVariant, type DrawerAnchor } from './components/Drawer';
export { LilyCarousel } from './components/Carousel';

// Primitives
export {
  LilyText,
  LilyHeading,
  type TextVariant,
  type TextTone,
  type HeadingLevel,
} from './components/Typography';
export { LilyLink, type LinkStatus } from './components/Link';
export { LilyIcon, type IconSize, type IconTone } from './components/Icon';
export { LilyAvatar, LilyAvatarGroup, type AvatarSize, type AvatarStatus } from './components/Avatar';
export { LilyDivider, type DividerOrientation } from './components/Divider';
export { LilyChip, type ChipStatus } from './components/Chip';
export { LilyKbd, LilyCode } from './components/Kbd';

// Forms
export { LilySegmentedControl, type SegmentedOption } from './components/SegmentedControl';
export { LilyNumberInput } from './components/NumberInput';
export { LilyRating } from './components/Rating';
export { LilyPinInput } from './components/PinInput';
export { LilyTagInput } from './components/TagInput';
export { LilyFileUpload } from './components/FileUpload';
export { LilyRangeDual } from './components/RangeDual';
export { LilyCombobox, type ComboboxOption } from './components/Combobox';
export { LilyTimePicker } from './components/TimePicker';
export { LilyDateRangePicker } from './components/DateRangePicker';

// Navigation & feedback
export { LilyStepper, type StepItem, type StepStatus } from './components/Stepper';
export { LilyEmptyState } from './components/EmptyState';
export { LilyStat, type StatTrend } from './components/Stat';
export { LilyTimeline, type TimelineItem, type TimelineStatus } from './components/Timeline';
export { LilySkeleton, type SkeletonVariant } from './components/Skeleton';
export { LilyMeter, type MeterStatus } from './components/Meter';
export { LilyMenu, type MenuItemDef } from './components/Menu';
export { LilyBackTop } from './components/BackTop';
export { LilyAffix } from './components/Affix';

// Rich UX
export { LilyScrollArea } from './components/ScrollArea';
export { LilyImage } from './components/Image';
export { LilySplitter } from './components/Splitter';
export { LilyTree, type TreeNode } from './components/Tree';
export { LilyCalendar } from './components/Calendar';
export { LilyTransfer, type TransferItem } from './components/Transfer';
export { LilyColorPicker, DEFAULT_SWATCHES } from './components/ColorPicker';
export { LilyCascader, type CascaderOption } from './components/Cascader';
export { LilyCommandPalette, type CommandItem } from './components/CommandPalette';

// Date & time, a11y, overlays, data display, utilities
export { LilyDateTimePicker } from './components/DateTimePicker';
export { LilyMonthPicker } from './components/MonthPicker';
export { LilyTimeZoneSelect } from './components/TimeZoneSelect';
export { LilyRelativeTime } from './components/RelativeTime';
export { LilyCountdown } from './components/Countdown';
export { LilyDurationInput } from './components/DurationInput';
export { LilyVisuallyHidden } from './components/VisuallyHidden';
export { LilyAlertDialog } from './components/AlertDialog';
export { LilyToolbar } from './components/Toolbar';
export { LilyFieldset } from './components/Fieldset';
export { LilyHoverCard } from './components/HoverCard';
export { LilyContextMenu, LilyContextMenuItem, LilyContextMenuDivider } from './components/ContextMenu';
export { LilyDescriptions, LilyDescriptionsItem } from './components/Descriptions';
export { LilyResult } from './components/Result';
export { LilyFloatButton, LilyFloatButtonGroup } from './components/FloatButton';
export { LilyCodeBlock } from './components/CodeBlock';
export { LilyMark } from './components/Mark';
export { LilyTreeSelect } from './components/TreeSelect';
export { LilyWatermark } from './components/Watermark';
export { LilyThemeOverride } from './components/ThemeOverride';
