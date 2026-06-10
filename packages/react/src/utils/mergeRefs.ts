import type { MutableRefObject, Ref } from 'react';

/**
 * Merge several React refs (callback or object) into one callback ref, so a
 * single DOM node can satisfy multiple consumers (e.g. a forwarded ref plus an
 * internal measuring ref).
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): (node: T | null) => void {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(node);
      else (ref as MutableRefObject<T | null>).current = node;
    }
  };
}
