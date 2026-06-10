/**
 * Framework-agnostic scrollspy — track which section is currently in view via
 * an IntersectionObserver. Mirrors the React `useScrollspy` hook's logic.
 */

export interface ScrollspyOptions {
  /** Ids of the sections to observe, in document order. */
  sectionIds: string[];
  /**
   * rootMargin for the IntersectionObserver; the default biases toward the
   * section near the top of the viewport.
   * @default '0px 0px -70% 0px'
   */
  rootMargin?: string;
}

/**
 * createScrollspy — observe `sectionIds` and call `onChange(activeId)` whenever
 * the section nearest the top of the viewport changes.
 *
 * Returns a cleanup function that disconnects the observer. No-ops (and returns
 * a no-op cleanup) where `IntersectionObserver` is unavailable.
 *
 * @example
 * ```ts
 * const stop = createScrollspy(
 *   { sectionIds: ['intro', 'usage', 'api'] },
 *   (id) => console.log('active', id),
 * );
 * // later: stop();
 * ```
 */
export function createScrollspy(
  { sectionIds, rootMargin = '0px 0px -70% 0px' }: ScrollspyOptions,
  onChange: (activeId: string) => void,
): () => void {
  if (typeof IntersectionObserver === 'undefined') return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) onChange(visible[0].target.id);
    },
    { rootMargin, threshold: 0 },
  );

  const els = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  els.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}
