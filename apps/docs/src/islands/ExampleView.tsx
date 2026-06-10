/* Renders an ExampleNode tree to real React elements (resolving Lily components,
 * including dotted sub-components and native HTML tags). The same node tree
 * drives the React/Vue/WC code, so preview and code always agree. */
import * as React from 'react';
import * as Lily from '@lily-ui/react';
import type { ExampleNode } from '../lib/example';

function resolve(name: string): React.ElementType | undefined {
  if (/^[a-z]/.test(name)) return name as React.ElementType; // native tag
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: any = Lily;
  for (const part of name.split('.')) cur = cur?.[part];
  return cur as React.ElementType | undefined;
}

export function renderNode(node: ExampleNode, key?: React.Key): React.ReactNode {
  const Comp = resolve(node.c);
  if (!Comp) return null;
  // Spread children as rest args so a single child is passed as itself (not a
  // one-element array) — components that `cloneElement(children)` rely on this.
  const children = (node.k ?? []).map((k, i) =>
    typeof k === 'string' ? k : renderNode(k, i),
  );
  return React.createElement(Comp, { ...(node.p as object), key }, ...children);
}
