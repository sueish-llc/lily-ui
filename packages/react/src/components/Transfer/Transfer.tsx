import { forwardRef, useState } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';
import { Button } from '../Button';

export interface TransferItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TransferProps {
  /** All available items. */
  items: TransferItem[];
  /** Controlled values currently in the target list. */
  value?: string[];
  /** Initial target values when uncontrolled. @default [] */
  defaultValue?: string[];
  /** Called with the updated target values. */
  onChange?: (target: string[]) => void;
  /** `[source, target]` list titles. @default ['Available', 'Selected'] */
  titles?: [string, string];
  /** Label for the move-to-target button. @default 'Add selected' */
  toTargetLabel?: string;
  /** Label for the move-to-source button. @default 'Remove selected' */
  toSourceLabel?: string;
  className?: string;
}

/**
 * Transfer — move items between a source and a target list. Each row is a
 * labeled checkbox; the controls move the checked rows across.
 *
 * @example
 * ```tsx
 * <Transfer items={all} defaultValue={['a']} titles={['候補', '選択済み']} />
 * ```
 */
export const Transfer = forwardRef<HTMLDivElement, TransferProps>(function Transfer(
  { items, value: valueProp, defaultValue = [], onChange, titles = ['Available', 'Selected'], toTargetLabel = 'Add selected', toSourceLabel = 'Remove selected', className },
  ref,
) {
  const [target, setTarget] = useControllableState<string[]>({ value: valueProp, defaultValue, onChange });
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const targetSet = new Set(target);

  const sourceItems = items.filter((it) => !targetSet.has(it.value));
  const targetItems = items.filter((it) => targetSet.has(it.value));

  const toggle = (v: string) => {
    const next = new Set(checked);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setChecked(next);
  };

  const moveToTarget = () => {
    const moving = sourceItems.filter((it) => checked.has(it.value) && !it.disabled).map((it) => it.value);
    setTarget([...target, ...moving]);
    setChecked(new Set([...checked].filter((v) => !moving.includes(v))));
  };
  const moveToSource = () => {
    const moving = targetItems.filter((it) => checked.has(it.value) && !it.disabled).map((it) => it.value);
    setTarget(target.filter((v) => !moving.includes(v)));
    setChecked(new Set([...checked].filter((v) => !moving.includes(v))));
  };

  const renderList = (title: string, list: TransferItem[]) => (
    <div className="lily-transfer__list">
      <div className="lily-transfer__header">{title}</div>
      <ul className="lily-transfer__items">
        {list.map((it) => (
          <li key={it.value}>
            <label className="lily-transfer__item">
              <input
                type="checkbox"
                checked={checked.has(it.value)}
                disabled={it.disabled}
                onChange={() => toggle(it.value)}
              />
              <span>{it.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );

  const hasSourceChecked = sourceItems.some((it) => checked.has(it.value));
  const hasTargetChecked = targetItems.some((it) => checked.has(it.value));

  return (
    <div ref={ref} className={cx('lily-transfer', className)}>
      {renderList(titles[0], sourceItems)}
      <div className="lily-transfer__actions">
        <Button size="sm" variant="outline" aria-label={toTargetLabel} disabled={!hasSourceChecked} onClick={moveToTarget}>
          <span aria-hidden="true">›</span>
        </Button>
        <Button size="sm" variant="outline" aria-label={toSourceLabel} disabled={!hasTargetChecked} onClick={moveToSource}>
          <span aria-hidden="true">‹</span>
        </Button>
      </div>
      {renderList(titles[1], targetItems)}
    </div>
  );
});
