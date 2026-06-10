/* Mobile navigation: a hamburger button that lives in the site header and opens
 * the library's temporary (overlay) Drawer. Renders nothing on wide screens,
 * where the permanent sidebar (SidebarNav) is shown instead. */
import * as React from 'react';
import { Drawer } from '@lily-ui/react';
import { NavList } from './NavList';
import type { NavGroup } from '../lib/nav';

export interface HeaderNavPrimaryLink {
  label: string;
  href: string;
  /** Opens in a new tab (e.g. the GitHub repo). */
  external?: boolean;
  /** Brand mark shown to the left of the label. */
  icon?: 'storybook' | 'github';
}

/** GitHub's mark (Octicons), monochrome via currentColor. */
function GitHubMark() {
  return (
    <svg
      className="gh-mark"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.601-3.347-1.169-3.347-1.169-.452-1.151-1.104-1.457-1.104-1.457-.901-.612.069-.6.069-.6.997.07 1.522 1.023 1.522 1.023.885 1.519 2.323 1.078 2.891.824.089-.641.347-1.078.633-1.326-2.207-.252-4.527-1.104-4.527-4.91 0-1.084.387-1.971 1.023-2.667-.103-.252-.443-1.265.098-2.635 0 0 .835-.269 2.736 1.019a9.32 9.32 0 0 1 2.49-.336c.845.004 1.696.114 2.49.336 1.901-1.288 2.736-1.019 2.736-1.019.541 1.37.201 2.383.099 2.635.637.696 1.022 1.583 1.022 2.667 0 3.815-2.323 4.654-4.537 4.901.357.307.674.916.674 1.846 0 1.333-.012 2.41-.012 2.737 0 .267.18.578.756.48C19.852 20.978 23 16.866 23 12c0-6.077-4.922-11-11-11Z" />
    </svg>
  );
}

/** Storybook's mark (storybookjs/icons), monochrome via currentColor. */
function StorybookMark() {
  return (
    <svg
      className="sb-mark"
      viewBox="0 0 14 14"
      width={16}
      height={16}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.042.616a.704.704 0 00-.66.729L1.816 12.9c.014.367.306.66.672.677l9.395.422h.032a.704.704 0 00.704-.703V.704c0-.015 0-.03-.002-.044a.704.704 0 00-.746-.659l-.773.049.057 1.615a.105.105 0 01-.17.086l-.52-.41-.617.468a.105.105 0 01-.168-.088L9.746.134 2.042.616zm8.003 4.747c-.247.192-2.092.324-2.092.05.04-1.045-.429-1.091-.689-1.091-.247 0-.662.075-.662.634 0 .57.607.893 1.32 1.27 1.014.538 2.24 1.188 2.24 2.823 0 1.568-1.273 2.433-2.898 2.433-1.676 0-3.141-.678-2.976-3.03.065-.275 2.197-.21 2.197 0-.026.971.195 1.256.753 1.256.43 0 .624-.236.624-.634 0-.602-.633-.958-1.361-1.367-.987-.554-2.148-1.205-2.148-2.7 0-1.494 1.027-2.489 2.86-2.489 1.832 0 2.832.98 2.832 2.845z"
      />
    </svg>
  );
}

export interface HeaderNavProps {
  groups: NavGroup[];
  /** Top-level links that are hidden from the header bar on phones. */
  primaryLinks?: HeaderNavPrimaryLink[];
  labels: { nav: string; menu: string; search: string; searchEmpty: string };
}

function useIsDesktop(): boolean {
  const [desktop, setDesktop] = React.useState(true);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(min-width: 60rem)');
    const onChange = () => setDesktop(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return desktop;
}

export default function HeaderNav({ groups, primaryLinks, labels }: HeaderNavProps) {
  const isDesktop = useIsDesktop();
  const [open, setOpen] = React.useState(false);

  // Close the overlay when a link inside it is followed.
  const onNavClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  };

  if (isDesktop) return null;

  return (
    <>
      <button
        type="button"
        className="header-nav-toggle"
        aria-label={labels.menu}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div onClickCapture={onNavClick}>
        <Drawer
          variant="temporary"
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          title={labels.menu}
        >
          {primaryLinks && primaryLinks.length > 0 && (
            <nav className="drawer-primary" aria-label={labels.menu}>
              <ul className="drawer-primary__list">
                {primaryLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.icon === 'storybook' && <StorybookMark />}
                      {link.icon === 'github' && <GitHubMark />}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <NavList
            groups={groups}
            labels={{ nav: labels.nav, search: labels.search, searchEmpty: labels.searchEmpty }}
          />
        </Drawer>
      </div>
    </>
  );
}
