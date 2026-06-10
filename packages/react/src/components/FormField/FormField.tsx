import { createContext, useContext, useId, type AriaAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

interface FieldContextValue {
  /** id for the control. */
  controlId: string;
  /** id of the help text, if present. */
  helpId?: string;
  /** id of the error text, if present. */
  errorId?: string;
  /** Whether the field is in an error state. */
  invalid: boolean;
  /** Whether the field is required. */
  required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Access the enclosing {@link FormField}'s wiring (id, aria-describedby parts,
 * invalid/required). Returns `null` when used outside a FormField, so controls
 * can also be used standalone.
 */
export function useField(): FieldContextValue | null {
  return useContext(FieldContext);
}

/**
 * Resolve the props a form control should spread to be correctly associated
 * with its {@link FormField} (id + aria-describedby + aria-invalid + required).
 * Props passed directly to the control win over the inherited field values.
 */
export function useFieldControl<
  P extends {
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: AriaAttributes['aria-invalid'];
    required?: boolean;
  },
>(props: P): P {
  const field = useField();
  if (!field) return props;

  const describedBy =
    [props['aria-describedby'], field.helpId, field.errorId].filter(Boolean).join(' ') || undefined;

  return {
    ...props,
    id: props.id ?? field.controlId,
    'aria-describedby': describedBy,
    'aria-invalid': props['aria-invalid'] ?? (field.invalid || undefined),
    required: props.required ?? field.required,
  };
}

export interface FormFieldProps {
  /** Field label text. */
  label: ReactNode;
  /** Optional help/hint text below the control. */
  help?: ReactNode;
  /** Error message; when present, the field is marked invalid. */
  error?: ReactNode;
  /** Mark the field as required (adds an indicator + `required` on control). */
  required?: boolean;
  /** Visually hide the label (still available to screen readers). */
  hideLabel?: boolean;
  /** The control (Input, Select, …). */
  children: ReactNode;
  className?: string;
}

const CLASS = 'lily-field';

/**
 * FormField — wires a label, help text, and error message to a form control.
 *
 * Provides ids via context so the child control gets `id`, `aria-describedby`,
 * `aria-invalid`, and `required` automatically. Works with any Lily form
 * control or a native element that reads {@link useFieldControl}.
 *
 * @example
 * ```tsx
 * <FormField label="Email" help="We never share it." error={err} required>
 *   <Input type="email" />
 * </FormField>
 * ```
 */
export function FormField({
  label,
  help,
  error,
  required = false,
  hideLabel = false,
  className,
  children,
}: FormFieldProps) {
  const base = useId();
  const controlId = `${base}-control`;
  const helpId = help ? `${base}-help` : undefined;
  const errorId = error ? `${base}-error` : undefined;
  const invalid = Boolean(error);

  return (
    <FieldContext.Provider value={{ controlId, helpId, errorId, invalid, required }}>
      <div className={cx(CLASS, className)}>
        <label className={cx('lily-label', hideLabel && 'lily-visually-hidden')} htmlFor={controlId}>
          {label}
          {required && (
            <span className="lily-label__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {children}
        {help && (
          <div className="lily-help" id={helpId}>
            {help}
          </div>
        )}
        {error && (
          <div className="lily-error" id={errorId}>
            {error}
          </div>
        )}
      </div>
    </FieldContext.Provider>
  );
}
