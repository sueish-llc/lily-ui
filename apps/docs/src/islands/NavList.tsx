import * as React from 'react';
import type { NavGroup } from '../lib/nav';

/** Normalise to compare hrefs against the current location (both base-prefixed). */
function samePath(href: string, path: string): boolean {
  const norm = (s: string) => (s.endsWith('/') ? s : `${s}/`);
  return norm(href) === norm(path);
}

export interface NavListLabels {
  /** Accessible name for the nav landmark. */
  nav: string;
  /** Placeholder + accessible name for the search field. */
  search: string;
  /** Shown when the query matches nothing. */
  searchEmpty: string;
}

export function NavList({ groups, labels }: { groups: NavGroup[]; labels: NavListLabels }) {
  const [path, setPath] = React.useState('');
  const [query, setQuery] = React.useState('');
  React.useEffect(() => setPath(window.location.pathname), []);

  const q = query.trim().toLowerCase();
  const visible = q
    ? groups
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) => item.label.toLowerCase().includes(q) || (item.keywords ?? '').includes(q),
          ),
        }))
        .filter((group) => group.items.length > 0)
    : groups;

  return (
    <nav className="sidebar" aria-label={labels.nav}>
      <div className="sidebar__search" role="search">
        <input
          type="search"
          className="sidebar__search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.search}
          aria-label={labels.search}
          autoComplete="off"
        />
      </div>
      {visible.length === 0 ? (
        <p className="sidebar__empty" role="status">
          {labels.searchEmpty}
        </p>
      ) : (
        visible.map((group) => (
          <div className="sidebar__group" key={group.label}>
            <h2 className="sidebar__title">{group.label}</h2>
            <ul className="sidebar__list">
              {group.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={samePath(item.href, path) ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </nav>
  );
}
