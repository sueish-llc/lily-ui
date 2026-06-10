/**
 * Cross-framework story harness.
 *
 * Storybook here runs the React renderer, but every Lily component ships for
 * three runtimes (React, Vue, Web Components) that emit the *same* markup. This
 * harness lets a single story render any of the three, switched live from the
 * "Framework" toolbar control, so they can be compared side by side.
 *
 * - **React**: rendered directly.
 * - **Vue**: mounted imperatively with `createApp(...).mount(container)`.
 * - **Web Components**: the custom element is created and inserted as DOM
 *   (registered once in `.storybook/preview.tsx`).
 */
import { useEffect, useRef, type ReactElement } from 'react';
import { createApp, type VNode } from 'vue';

export type Framework = 'react' | 'vue' | 'web-components';

export const FRAMEWORKS: { value: Framework; title: string }[] = [
  { value: 'react', title: 'React' },
  { value: 'vue', title: 'Vue' },
  { value: 'web-components', title: 'Web Components' },
];

/** Mount a Vue render function into a host `<div>`, re-mounting when args change. */
function VueMount({ render, depKey }: { render: () => VNode; depKey: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const app = createApp({ render });
    app.mount(el);
    return () => app.unmount();
    // depKey changes whenever the story args change → re-mount with new props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey]);
  return <div ref={host} />;
}

/** Insert a built DOM element (a Lily custom element) into a host `<div>`. */
function WcMount({ build, depKey }: { build: () => HTMLElement; depKey: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    el.replaceChildren(build());
    return () => el.replaceChildren();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey]);
  return <div ref={host} />;
}

/** Tiny DOM builder for the Web Components stories. */
export function el(
  tag: string,
  attrs: Record<string, string | number | boolean | null | undefined> = {},
  children?: string | Node | Array<string | Node>,
): HTMLElement {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    node.setAttribute(k, v === true ? '' : String(v));
  }
  if (children != null) {
    const list = Array.isArray(children) ? children : [children];
    node.append(...list);
  }
  return node;
}

export interface TrioDefs<A> {
  /** React implementation. */
  react: (args: A) => ReactElement;
  /** Vue implementation — return a render function (e.g. `() => h(Button, props, slots)`). */
  vue: (args: A) => () => VNode;
  /** Web Components implementation — return a DOM element (use {@link el}). */
  wc: (args: A) => HTMLElement;
}

/**
 * Build a Storybook `render` function that shows the React / Vue / Web Component
 * implementation based on the active "Framework" toolbar global.
 */
export function trio<A>(defs: TrioDefs<A>) {
  return function FrameworkRender(args: A, ctx: { globals: Record<string, unknown> }) {
    const framework = (ctx.globals.framework as Framework | undefined) ?? 'react';
    const depKey = `${framework}:${JSON.stringify(args)}`;
    if (framework === 'vue') return <VueMount render={defs.vue(args)} depKey={depKey} />;
    if (framework === 'web-components') return <WcMount build={() => defs.wc(args)} depKey={depKey} />;
    return defs.react(args);
  };
}
