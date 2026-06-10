import { useEffect, useState } from 'react';

export interface UseScrollspyOptions {
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
 * useScrollspy — track which section is currently in view.
 *
 * Returns the id of the active section. Uses IntersectionObserver, so it's
 * efficient and SSR-safe (returns the first id until mounted).
 *
 * @example
 * ```tsx
 * const active = useScrollspy({ sectionIds: ['intro', 'usage', 'api'] });
 * <a aria-current={active === 'usage' ? 'true' : undefined} href="#usage">Usage</a>
 * ```
 */
export function useScrollspy({
  sectionIds,
  rootMargin = '0px 0px -70% 0px',
}: UseScrollspyOptions): string | null {
  const [active, setActive] = useState<string | null>(sectionIds[0] ?? null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin, threshold: 0 },
    );

    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return active;
}
