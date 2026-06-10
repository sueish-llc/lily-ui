/**
 * Minimal, dependency-free className combiner.
 *
 * Accepts strings, falsy values (skipped), and objects mapping class -> boolean.
 * Kept tiny on purpose so it adds ~nothing to bundle size.
 *
 * @example
 * cx('btn', isActive && 'btn--active', { 'btn--lg': size === 'lg' })
 */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean | null | undefined>;

export function cx(...args: ClassValue[]): string {
  const out: string[] = [];
  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === 'string' || typeof arg === 'number') {
      out.push(String(arg));
    } else if (typeof arg === 'object') {
      for (const key in arg) {
        if (arg[key]) out.push(key);
      }
    }
  }
  return out.join(' ');
}
