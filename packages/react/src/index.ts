/**
 * @lily-ui/react — public API.
 *
 * Pair with the CSS layer (import once at your app entry):
 * ```ts
 * import '@lily-ui/css/styles';
 * ```
 *
 * @packageDocumentation
 */

// Providers & theming
export {
  ThemeProvider,
  ThemeScript,
  useTheme,
  type ThemeMode,
  type ResolvedTheme,
  type ThemeProviderProps,
} from './providers/ThemeProvider';
export {
  MotionProvider,
  MotionScript,
  useMotionLevel,
  type MotionProviderProps,
} from './providers/MotionProvider';
export * from './components/ThemeOverride';

// Motion
export {
  type MotionLevel,
  type MotionPreference,
  prefersReducedMotion,
  detectMotionLevel,
  resolveMotionLevel,
} from './motion/level';
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
} from './motion/animations';
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
} from './motion/effects';

// Utilities
export { cx, type ClassValue } from './utils/cx';
export type { PolymorphicProps, AsProp } from './utils/polymorphic';
export {
  toPlainDate,
  today,
  addDays,
  diffInDays,
  isToday,
  formatDate,
  type PlainDateInput,
} from './utils/datetime';

// Components
export * from './components/Button';
export * from './components/Container';
export * from './components/Grid';
export * from './components/Stack';
export * from './components/CloseButton';
export * from './components/CopyButton';
export * from './components/Spinner';
export * from './components/Badge';
export * from './components/Ratio';
export * from './components/Table';
export * from './components/Alert';
export * from './components/Card';
export * from './components/Breadcrumb';
export * from './components/Pagination';
export * from './components/Progress';
export * from './components/ListGroup';
export * from './components/ButtonGroup';
export * from './components/FormField';
export * from './components/Input';
export * from './components/Textarea';
export * from './components/Select';
export * from './components/Checkbox';
export * from './components/Radio';
export * from './components/Switch';
export * from './components/Range';
export * from './components/InputGroup';
export * from './components/FloatingLabel';
export * from './components/DatePicker';
export * from './components/Collapse';
export * from './components/Accordion';
export * from './components/Tabs';
export * from './components/Navbar';
export * from './components/Footer';
export * from './components/Dropdown';
export * from './components/Modal';
export * from './components/Offcanvas';
export * from './components/Drawer';
export * from './components/Toast';
export * from './components/Tooltip';
export * from './components/Popover';
export * from './components/Carousel';
export * from './components/Scrollspy';
export * from './components/Presence';

// Primitives
export * from './components/Typography';
export * from './components/Link';
export * from './components/Icon';
export * from './components/Avatar';
export * from './components/Divider';
export * from './components/Chip';
export * from './components/Kbd';

// Forms
export * from './components/SegmentedControl';
export * from './components/NumberInput';
export * from './components/Rating';
export * from './components/PinInput';
export * from './components/TagInput';
export * from './components/FileUpload';
export * from './components/RangeDual';
export * from './components/Combobox';
export * from './components/TimePicker';
export * from './components/DateRangePicker';

// Navigation & feedback
export * from './components/Stepper';
export * from './components/EmptyState';
export * from './components/Stat';
export * from './components/Timeline';
export * from './components/Skeleton';
export * from './components/Meter';
export * from './components/Menu';
export * from './components/BackTop';
export * from './components/Affix';

// Rich UX
export * from './components/ScrollArea';
export * from './components/Image';
export * from './components/Splitter';
export * from './components/Tree';
export * from './components/Calendar';
export * from './components/Transfer';
export * from './components/ColorPicker';
export * from './components/Cascader';
export * from './components/CommandPalette';

// Date & time, a11y, overlays, data display, utilities
export * from './components/DateTimePicker';
export * from './components/MonthPicker';
export * from './components/TimeZoneSelect';
export * from './components/RelativeTime';
export * from './components/Countdown';
export * from './components/DurationInput';
export * from './components/VisuallyHidden';
export * from './components/AlertDialog';
export * from './components/Toolbar';
export * from './components/Fieldset';
export * from './components/HoverCard';
export * from './components/ContextMenu';
export * from './components/Descriptions';
export * from './components/Result';
export * from './components/FloatButton';
export * from './components/CodeBlock';
export * from './components/Mark';
export * from './components/TreeSelect';
export * from './components/Watermark';

// Hooks
export * from './hooks';
