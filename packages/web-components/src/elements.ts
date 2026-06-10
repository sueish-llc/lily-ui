import { define } from './base/LilyElement';
import { LilyButton } from './components/Button';
import { LilyButtonGroup } from './components/ButtonGroup';
import { LilyCloseButton } from './components/CloseButton';
import { LilyCopyButton } from './components/CopyButton';
import { LilyContainer } from './components/Container';
import { LilyStack } from './components/Stack';
import { LilyRow } from './components/Row';
import { LilyCol } from './components/Col';
import { LilyRatio } from './components/Ratio';
import { LilyBadge } from './components/Badge';
import { LilySpinner } from './components/Spinner';
import { LilyProgress } from './components/Progress';
import { LilyTable } from './components/Table';
import { LilyCard, LilyCardHeader, LilyCardBody, LilyCardFooter, LilyCardTitle } from './components/Card';
import { LilyListGroup, LilyListGroupItem } from './components/ListGroup';
import { LilyAlert } from './components/Alert';
import { LilyBreadcrumb } from './components/Breadcrumb';
import { LilyPagination } from './components/Pagination';
import { LilyNavbar } from './components/Navbar';
import { LilyFooter } from './components/Footer';
import { LilyTabs } from './components/Tabs';
import { LilyFormField } from './components/FormField';
import { LilyInput } from './components/Input';
import { LilyTextarea } from './components/Textarea';
import { LilySelect } from './components/Select';
import { LilyCheckbox } from './components/Checkbox';
import { LilyRadio } from './components/Radio';
import { LilySwitch } from './components/Switch';
import { LilyRange } from './components/Range';
import { LilyInputGroup, LilyInputGroupAddon } from './components/InputGroup';
import { LilyFloatingLabel } from './components/FloatingLabel';
import { LilyDatePicker } from './components/DatePicker';
import { LilyCollapse } from './components/Collapse';
import { LilyAccordion } from './components/Accordion';
import { LilyDropdown, LilyDropdownItem, LilyDropdownDivider } from './components/Dropdown';
import { LilyTooltip } from './components/Tooltip';
import { LilyPopover } from './components/Popover';
import { LilyModal } from './components/Modal';
import { LilyOffcanvas } from './components/Offcanvas';
import { LilyDrawer } from './components/Drawer';
import { LilyCarousel } from './components/Carousel';
import { LilyToastRegion } from './components/Toast';
import { LilyText, LilyHeading } from './components/Typography';
import { LilyLink } from './components/Link';
import { LilyIcon } from './components/Icon';
import { LilyAvatar, LilyAvatarGroup } from './components/Avatar';
import { LilyDivider } from './components/Divider';
import { LilyChip } from './components/Chip';
import { LilyKbd, LilyCode } from './components/Kbd';
import { LilySegmentedControl } from './components/SegmentedControl';
import { LilyNumberInput } from './components/NumberInput';
import { LilyRating } from './components/Rating';
import { LilyPinInput } from './components/PinInput';
import { LilyTagInput } from './components/TagInput';
import { LilyFileUpload } from './components/FileUpload';
import { LilyRangeDual } from './components/RangeDual';
import { LilyCombobox } from './components/Combobox';
import { LilyTimePicker } from './components/TimePicker';
import { LilyDateRangePicker } from './components/DateRangePicker';
import { LilyStepper } from './components/Stepper';
import { LilyEmptyState } from './components/EmptyState';
import { LilyStat } from './components/Stat';
import { LilyTimeline } from './components/Timeline';
import { LilySkeleton } from './components/Skeleton';
import { LilyMeter } from './components/Meter';
import { LilyMenu } from './components/Menu';
import { LilyBackTop } from './components/BackTop';
import { LilyAffix } from './components/Affix';
import { LilyScrollArea } from './components/ScrollArea';
import { LilyImage } from './components/Image';
import { LilySplitter } from './components/Splitter';
import { LilyTree } from './components/Tree';
import { LilyCalendar } from './components/Calendar';
import { LilyTransfer } from './components/Transfer';
import { LilyColorPicker } from './components/ColorPicker';
import { LilyCascader } from './components/Cascader';
import { LilyCommandPalette } from './components/CommandPalette';
import { LilyDateTimePicker } from './components/DateTimePicker';
import { LilyMonthPicker } from './components/MonthPicker';
import { LilyTimeZoneSelect } from './components/TimeZoneSelect';
import { LilyRelativeTime } from './components/RelativeTime';
import { LilyCountdown } from './components/Countdown';
import { LilyDurationInput } from './components/DurationInput';
import { LilyVisuallyHidden } from './components/VisuallyHidden';
import { LilyAlertDialog } from './components/AlertDialog';
import { LilyToolbar } from './components/Toolbar';
import { LilyFieldset } from './components/Fieldset';
import { LilyHoverCard } from './components/HoverCard';
import { LilyContextMenu, LilyContextMenuItem, LilyContextMenuDivider } from './components/ContextMenu';
import { LilyDescriptions, LilyDescriptionsItem } from './components/Descriptions';
import { LilyResult } from './components/Result';
import { LilyFloatButton, LilyFloatButtonGroup } from './components/FloatButton';
import { LilyCodeBlock } from './components/CodeBlock';
import { LilyMark } from './components/Mark';
import { LilyTreeSelect } from './components/TreeSelect';
import { LilyWatermark } from './components/Watermark';
import { LilyThemeOverride } from './components/ThemeOverride';

/**
 * The full registry of Lily custom elements as `[tag-name, constructor]` pairs.
 * Used by {@link defineLilyElements} and the side-effecting `./define` entry.
 */
export const elements: ReadonlyArray<readonly [string, CustomElementConstructor]> = [
  ['lily-button', LilyButton],
  ['lily-button-group', LilyButtonGroup],
  ['lily-close-button', LilyCloseButton],
  ['lily-copy-button', LilyCopyButton],
  ['lily-container', LilyContainer],
  ['lily-stack', LilyStack],
  ['lily-row', LilyRow],
  ['lily-col', LilyCol],
  ['lily-ratio', LilyRatio],
  ['lily-badge', LilyBadge],
  ['lily-spinner', LilySpinner],
  ['lily-progress', LilyProgress],
  ['lily-table', LilyTable],
  ['lily-card', LilyCard],
  ['lily-card-header', LilyCardHeader],
  ['lily-card-body', LilyCardBody],
  ['lily-card-footer', LilyCardFooter],
  ['lily-card-title', LilyCardTitle],
  ['lily-list-group', LilyListGroup],
  ['lily-list-group-item', LilyListGroupItem],
  ['lily-alert', LilyAlert],
  ['lily-breadcrumb', LilyBreadcrumb],
  ['lily-pagination', LilyPagination],
  ['lily-navbar', LilyNavbar],
  ['lily-footer', LilyFooter],
  ['lily-tabs', LilyTabs],
  ['lily-form-field', LilyFormField],
  ['lily-input', LilyInput],
  ['lily-textarea', LilyTextarea],
  ['lily-select', LilySelect],
  ['lily-checkbox', LilyCheckbox],
  ['lily-radio', LilyRadio],
  ['lily-switch', LilySwitch],
  ['lily-range', LilyRange],
  ['lily-input-group', LilyInputGroup],
  ['lily-input-group-addon', LilyInputGroupAddon],
  ['lily-floating-label', LilyFloatingLabel],
  ['lily-date-picker', LilyDatePicker],
  ['lily-collapse', LilyCollapse],
  ['lily-accordion', LilyAccordion],
  ['lily-dropdown', LilyDropdown],
  ['lily-dropdown-item', LilyDropdownItem],
  ['lily-dropdown-divider', LilyDropdownDivider],
  ['lily-tooltip', LilyTooltip],
  ['lily-popover', LilyPopover],
  ['lily-modal', LilyModal],
  ['lily-offcanvas', LilyOffcanvas],
  ['lily-drawer', LilyDrawer],
  ['lily-carousel', LilyCarousel],
  ['lily-toast-region', LilyToastRegion],
  // Primitives
  ['lily-text', LilyText],
  ['lily-heading', LilyHeading],
  ['lily-link', LilyLink],
  ['lily-icon', LilyIcon],
  ['lily-avatar', LilyAvatar],
  ['lily-avatar-group', LilyAvatarGroup],
  ['lily-divider', LilyDivider],
  ['lily-chip', LilyChip],
  ['lily-kbd', LilyKbd],
  ['lily-code', LilyCode],
  // Forms
  ['lily-segmented-control', LilySegmentedControl],
  ['lily-number-input', LilyNumberInput],
  ['lily-rating', LilyRating],
  ['lily-pin-input', LilyPinInput],
  ['lily-tag-input', LilyTagInput],
  ['lily-file-upload', LilyFileUpload],
  ['lily-range-dual', LilyRangeDual],
  ['lily-combobox', LilyCombobox],
  ['lily-time-picker', LilyTimePicker],
  ['lily-date-range-picker', LilyDateRangePicker],
  // Navigation & feedback
  ['lily-stepper', LilyStepper],
  ['lily-empty-state', LilyEmptyState],
  ['lily-stat', LilyStat],
  ['lily-timeline', LilyTimeline],
  ['lily-skeleton', LilySkeleton],
  ['lily-meter', LilyMeter],
  ['lily-menu', LilyMenu],
  ['lily-back-top', LilyBackTop],
  ['lily-affix', LilyAffix],
  // Rich UX
  ['lily-scroll-area', LilyScrollArea],
  ['lily-image', LilyImage],
  ['lily-splitter', LilySplitter],
  ['lily-tree', LilyTree],
  ['lily-calendar', LilyCalendar],
  ['lily-transfer', LilyTransfer],
  ['lily-color-picker', LilyColorPicker],
  ['lily-cascader', LilyCascader],
  ['lily-command-palette', LilyCommandPalette],
  ['lily-date-time-picker', LilyDateTimePicker],
  ['lily-month-picker', LilyMonthPicker],
  ['lily-time-zone-select', LilyTimeZoneSelect],
  ['lily-relative-time', LilyRelativeTime],
  ['lily-countdown', LilyCountdown],
  ['lily-duration-input', LilyDurationInput],
  ['lily-visually-hidden', LilyVisuallyHidden],
  ['lily-alert-dialog', LilyAlertDialog],
  ['lily-toolbar', LilyToolbar],
  ['lily-fieldset', LilyFieldset],
  ['lily-hover-card', LilyHoverCard],
  ['lily-context-menu', LilyContextMenu],
  ['lily-context-menu-item', LilyContextMenuItem],
  ['lily-context-menu-divider', LilyContextMenuDivider],
  ['lily-descriptions', LilyDescriptions],
  ['lily-descriptions-item', LilyDescriptionsItem],
  ['lily-result', LilyResult],
  ['lily-float-button', LilyFloatButton],
  ['lily-float-button-group', LilyFloatButtonGroup],
  ['lily-code-block', LilyCodeBlock],
  ['lily-mark', LilyMark],
  ['lily-tree-select', LilyTreeSelect],
  ['lily-watermark', LilyWatermark],
  ['lily-theme-override', LilyThemeOverride],
];

/**
 * Register every Lily custom element (idempotent — already-defined tags are
 * skipped). Call once during app startup, or import `@lily-ui/web-components/define`
 * for the same effect as a side-effecting import.
 */
export function defineLilyElements(): void {
  for (const [name, ctor] of elements) define(name, ctor);
}
