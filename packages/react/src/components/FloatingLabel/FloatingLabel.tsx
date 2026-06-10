import { useId, type ReactElement, type ReactNode, cloneElement } from 'react';
import { cx } from '../../utils/cx';

export interface FloatingLabelProps {
  /** The floating label text. */
  label: ReactNode;
  /**
   * A single control element (Input/Select/Textarea). It receives an `id` and,
   * for inputs, a `placeholder` (required for the CSS float trigger).
   */
  children: ReactElement<{ id?: string; placeholder?: string }>;
  className?: string;
}

const CLASS = 'lily-floating';

/**
 * FloatingLabel — a label that floats above the control when it has focus or a
 * value. Wrap a single Input/Select/Textarea.
 *
 * The label is a real `<label htmlFor>`, so it remains fully accessible.
 *
 * @example
 * ```tsx
 * <FloatingLabel label="Email"><Input type="email" /></FloatingLabel>
 * ```
 */
export function FloatingLabel({ label, children, className }: FloatingLabelProps) {
  const id = useId();
  const controlId = children.props.id ?? id;
  // Inputs need a placeholder so `:not(:placeholder-shown)` can drive the float.
  const control = cloneElement(children, {
    id: controlId,
    placeholder: children.props.placeholder ?? ' ',
  });

  return (
    <div className={cx(CLASS, className)}>
      {control}
      <label htmlFor={controlId}>{label}</label>
    </div>
  );
}
