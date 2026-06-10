import { useCallback, useRef, useState } from 'react';

/**
 * Manage state that may be controlled (via `value`) or uncontrolled (via
 * `defaultValue`). Mirrors the common controlled/uncontrolled component pattern.
 *
 * @returns `[value, setValue]` where `setValue` calls `onChange` and, when
 * uncontrolled, also updates internal state.
 */
export function useControllableState<T>(options: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: T) => void] {
  const { value, defaultValue, onChange } = options;
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<T>(defaultValue);

  // Keep the latest onChange without retriggering the setter identity.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const current = isControlled ? (value as T) : internal;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [current, setValue];
}
