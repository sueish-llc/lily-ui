import { useId, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface NavbarProps {
  /** Brand/logo content (links to home). */
  brand?: ReactNode;
  /** href for the brand. @default '#' */
  brandHref?: string;
  /** Nav content shown in the collapsible area. */
  children: ReactNode;
  /** Accessible label for the nav landmark. @default 'Main' */
  label?: string;
  /** Label for the mobile toggle button. @default 'Toggle navigation' */
  toggleLabel?: string;
  className?: string;
}

const CLASS = 'lily-navbar';

/**
 * Navbar — responsive top navigation. Collapses to a toggle on small screens.
 *
 * Renders a `<nav>` landmark; the toggle exposes `aria-expanded` +
 * `aria-controls` for the collapsible region.
 *
 * @example
 * ```tsx
 * <Navbar brand="Lily">
 *   <a href="/docs">Docs</a>
 *   <a href="/about">About</a>
 * </Navbar>
 * ```
 */
export function Navbar({
  brand,
  brandHref = '#',
  children,
  label = 'Main',
  toggleLabel = 'Toggle navigation',
  className,
}: NavbarProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label={label} className={cx(CLASS, className)}>
      {brand && (
        <a className={`${CLASS}__brand`} href={brandHref}>
          {brand}
        </a>
      )}
      <button
        type="button"
        className={`${CLASS}__toggle`}
        aria-expanded={open}
        aria-controls={id}
        aria-label={toggleLabel}
        onClick={() => setOpen(!open)}
      >
        <span aria-hidden="true">&#9776;</span>
      </button>
      <div
        id={id}
        className={cx(`${CLASS}__collapse`, open && `${CLASS}__collapse--open`)}
      >
        {children}
      </div>
    </nav>
  );
}
