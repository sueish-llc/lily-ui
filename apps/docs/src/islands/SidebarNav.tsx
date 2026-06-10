/* Desktop sidebar: the library's permanent Drawer. On narrow screens it renders
 * nothing — the header hamburger + temporary Drawer (HeaderNav) take over. */
import * as React from 'react';
import { Drawer } from '@lily-ui/react';
import { NavList } from './NavList';
import type { NavGroup } from '../lib/nav';

export interface SidebarNavProps {
  groups: NavGroup[];
  labels: { nav: string; search: string; searchEmpty: string };
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

export default function SidebarNav({ groups, labels }: SidebarNavProps) {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return null;
  return (
    <Drawer variant="permanent" anchor="left" className="docs-drawer">
      <NavList groups={groups} labels={labels} />
    </Drawer>
  );
}
