import { forwardRef } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

export interface CascaderOption {
  value: string;
  label: string;
  disabled?: boolean;
  children?: CascaderOption[];
}

export interface CascaderProps {
  /** Root options (with nested `children`). */
  options: CascaderOption[];
  /** Controlled selected path of values. */
  value?: string[];
  /** Initial path when uncontrolled. @default [] */
  defaultValue?: string[];
  /** Called with the updated path. */
  onChange?: (path: string[]) => void;
  /** Accessible label for the cascader. @default 'Cascader' */
  'aria-label'?: string;
  className?: string;
}

/**
 * Cascader — hierarchical selection shown as side-by-side columns. Picking an
 * option reveals its children in the next column; the value is the chosen path.
 *
 * @example
 * ```tsx
 * <Cascader aria-label="地域" options={regions} onChange={setPath} />
 * ```
 */
export const Cascader = forwardRef<HTMLDivElement, CascaderProps>(function Cascader(
  { options, value: valueProp, defaultValue = [], onChange, className, ...rest },
  ref,
) {
  const [path, setPath] = useControllableState<string[]>({ value: valueProp, defaultValue, onChange });

  // Build the visible columns by walking the selected path.
  const columns: CascaderOption[][] = [options];
  let level = options;
  for (const id of path) {
    const opt = level.find((o) => o.value === id);
    if (opt?.children?.length) {
      columns.push(opt.children);
      level = opt.children;
    } else break;
  }

  return (
    <div ref={ref} className={cx('lily-cascader', className)} role="group" aria-label={rest['aria-label'] ?? 'Cascader'}>
      {columns.map((col, depth) => (
        <div key={depth} className="lily-cascader__column">
          {col.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={cx('lily-cascader__option', path[depth] === opt.value && 'lily-cascader__option--active')}
              aria-disabled={opt.disabled || undefined}
              disabled={opt.disabled}
              onClick={() => setPath([...path.slice(0, depth), opt.value])}
            >
              <span>{opt.label}</span>
              {opt.children?.length ? (
                <span className="lily-cascader__arrow" aria-hidden="true">
                  ›
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
});
