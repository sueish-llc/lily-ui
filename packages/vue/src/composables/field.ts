import { computed, inject, provide, type ComputedRef, type InjectionKey } from 'vue';

export interface FieldContext {
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

const FIELD_KEY: InjectionKey<ComputedRef<FieldContext | null>> = Symbol('lily-field');

/** Provide a {@link FieldContext} to descendant controls (used by FormField). */
export function provideField(ctx: ComputedRef<FieldContext | null>): void {
  provide(FIELD_KEY, ctx);
}

/**
 * Access the enclosing FormField's wiring. Returns a ref to `null` when used
 * outside a FormField, so controls can also be used standalone.
 */
export function useField(): ComputedRef<FieldContext | null> {
  return inject(
    FIELD_KEY,
    computed(() => null),
  );
}

export interface FieldControlProps {
  id?: string;
  ['aria-describedby']?: string;
  ['aria-invalid']?: boolean | 'true' | 'false';
  required?: boolean;
}

/**
 * Resolve the attributes a form control should bind to be correctly associated
 * with its FormField (id + aria-describedby + aria-invalid + required). Props
 * passed directly to the control win over the inherited field values.
 */
export function useFieldControl(
  props: () => FieldControlProps,
): ComputedRef<Record<string, unknown>> {
  const field = useField();
  return computed(() => {
    const p = props();
    const f = field.value;
    if (!f) return { ...p };
    const describedBy =
      [p['aria-describedby'], f.helpId, f.errorId].filter(Boolean).join(' ') || undefined;
    return {
      ...p,
      id: p.id ?? f.controlId,
      'aria-describedby': describedBy,
      'aria-invalid': p['aria-invalid'] ?? (f.invalid || undefined),
      required: p.required ?? f.required,
    };
  });
}
