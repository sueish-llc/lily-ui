import { forwardRef, useId, useRef, useState, type AriaAttributes, type KeyboardEvent } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState, useDismiss } from '../../hooks';
import { useFieldControl } from '../FormField';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Selectable options. */
  options: ComboboxOption[];
  /** Controlled selected value (`null` = none). */
  value?: string | null;
  /** Initial value when uncontrolled. @default null */
  defaultValue?: string | null;
  /** Called with the newly selected value (`null` when cleared). */
  onChange?: (value: string | null) => void;
  /** Field placeholder. */
  placeholder?: string;
  /** Disable the control. @default false */
  disabled?: boolean;
  /** Text shown when no options match. @default 'No matches' */
  emptyText?: string;
  /** Control size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Custom filter predicate. @default case-insensitive label `includes`. */
  filter?: (option: ComboboxOption, query: string) => boolean;
  /** Accessible label (when not wrapped in a FormField). */
  'aria-label'?: string;
  id?: string;
  name?: string;
  className?: string;
}

const defaultFilter = (o: ComboboxOption, q: string) => o.label.toLowerCase().includes(q.toLowerCase());

/**
 * Combobox — a text field with a filtered listbox popup (WAI-ARIA combobox).
 * Type to filter; Down/Up move the active option, Enter selects, Escape closes.
 *
 * @example
 * ```tsx
 * <Combobox aria-label="国" options={countries} onChange={setCountry} />
 * ```
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  { options, value: valueProp, defaultValue = null, onChange, placeholder, disabled = false, emptyText = 'No matches', size = 'md', filter = defaultFilter, id, name, className, ...rest },
  ref,
) {
  const reactId = useId();
  const fieldProps = useFieldControl<{
    id?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: AriaAttributes['aria-invalid'];
    required?: boolean;
  }>({ id, 'aria-label': rest['aria-label'] });
  const inputId = fieldProps.id ?? `${reactId}-input`;
  const listboxId = `${reactId}-listbox`;
  const [value, setValue] = useControllableState<string | null>({ value: valueProp, defaultValue, onChange });
  const selected = options.find((o) => o.value === value) ?? null;
  const [query, setQuery] = useState(selected?.label ?? '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useDismiss(rootRef, open, () => setOpen(false));

  const matches = query === (selected?.label ?? '') && !open ? options : options.filter((o) => filter(o, query));

  const choose = (opt: ComboboxOption) => {
    if (opt.disabled) return;
    setValue(opt.value);
    setQuery(opt.label);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      setActive((a) => Math.min(matches.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter' && open && matches[active]) {
      e.preventDefault();
      choose(matches[active]!);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cx('lily-combobox', className)}>
      <input
        ref={ref}
        id={inputId}
        name={name}
        className={cx('lily-input', size !== 'md' && `lily-input--${size}`)}
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={open && matches[active] ? `${listboxId}-${active}` : undefined}
        aria-label={fieldProps['aria-label']}
        aria-describedby={fieldProps['aria-describedby']}
        aria-invalid={fieldProps['aria-invalid']}
        required={fieldProps.required}
        autoComplete="off"
        placeholder={placeholder}
        disabled={disabled}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      <ul className="lily-combobox__listbox" id={listboxId} role="listbox" hidden={!open}>
        {matches.length === 0 ? (
          <li className="lily-combobox__empty" role="presentation">
            {emptyText}
          </li>
        ) : (
          matches.map((opt, i) => (
            <li
              key={opt.value}
              id={`${listboxId}-${i}`}
              className={cx('lily-combobox__option', i === active && 'lily-combobox__option--active')}
              role="option"
              aria-selected={opt.value === value}
              aria-disabled={opt.disabled || undefined}
              onPointerDown={(e) => {
                e.preventDefault();
                choose(opt);
              }}
              onPointerEnter={() => setActive(i)}
            >
              {opt.label}
            </li>
          ))
        )}
      </ul>
    </div>
  );
});
