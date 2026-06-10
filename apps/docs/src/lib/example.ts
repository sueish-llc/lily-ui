// A single source of truth for a component example: one declarative node tree
// that (a) renders the live preview and (b) generates matching React / Vue /
// Web Components source — so the playground's preview and code never drift.
//
// `c` is the React component name (sub-components use a dot, e.g. 'Card.Header').
// The Vue name drops the dot ('CardHeader'); the WC tag is `lily-<kebab>`.

export interface ExampleNode {
  c: string;
  /** Props. Arrays/objects are emitted as JS literals (React/Vue) or JSON
   *  attributes (WC). */
  p?: Record<string, unknown>;
  /** Children: strings (text) or nested nodes. */
  k?: Array<ExampleNode | string>;
}

export type Framework = 'react' | 'vue' | 'wc';

const kebab = (s: string) =>
  s
    .replace(/\./g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();

/** Lowercase `c` denotes a native HTML element (option, tr, p, …). */
const isNative = (c: string) => /^[a-z]/.test(c);

const vueName = (c: string) => (isNative(c) ? c : c.replace(/\./g, ''));
const wcTag = (c: string) => (isNative(c) ? c : `lily-${kebab(c)}`);

const isNode = (x: unknown): x is ExampleNode =>
  typeof x === 'object' && x !== null && 'c' in (x as object);

/** A JS literal for React/Vue prop values (objects/arrays/numbers/booleans). */
function jsLiteral(v: unknown): string {
  return JSON.stringify(v, null, 2).replace(/\n/g, '\n');
}

const indent = (s: string, pad: string) =>
  s
    .split('\n')
    .map((l) => (l ? pad + l : l))
    .join('\n');

// ---------------------------------------------------------------------------
// Attribute formatting per framework
// ---------------------------------------------------------------------------

function reactAttrs(p: Record<string, unknown> = {}): string {
  const out: string[] = [];
  for (const [k, v] of Object.entries(p)) {
    if (v === undefined) continue;
    if (typeof v === 'boolean') out.push(v ? k : `${k}={false}`);
    else if (typeof v === 'string') out.push(`${k}="${v}"`);
    else out.push(`${k}={${jsLiteral(v)}}`);
  }
  return out.join(' ');
}

function vueAttrs(p: Record<string, unknown> = {}): string {
  const out: string[] = [];
  for (const [k, v] of Object.entries(p)) {
    if (v === undefined) continue;
    if (typeof v === 'boolean') out.push(v ? k : `:${k}="false"`);
    else if (typeof v === 'string') out.push(`${k}="${v}"`);
    else out.push(`:${k}="${jsLiteral(v)}"`);
  }
  return out.join(' ');
}

function wcAttrs(p: Record<string, unknown> = {}): string {
  const out: string[] = [];
  for (const [k, v] of Object.entries(p)) {
    if (v === undefined) continue;
    const a = kebab(k);
    if (typeof v === 'boolean') {
      if (v) out.push(a);
    } else if (typeof v === 'string' || typeof v === 'number') {
      out.push(`${a}="${v}"`);
    } else {
      out.push(`${a}='${JSON.stringify(v)}'`);
    }
  }
  return out.join(' ');
}

// ---------------------------------------------------------------------------
// Element rendering per framework (recursive)
// ---------------------------------------------------------------------------

function el(
  node: ExampleNode,
  name: (c: string) => string,
  attrs: (p?: Record<string, unknown>) => string,
): string {
  const tag = name(node.c);
  const a = attrs(node.p);
  const open = a ? `${tag} ${a}` : tag;
  const kids = node.k ?? [];
  if (kids.length === 0) return `<${open} />`;

  const simple = kids.length === 1 && typeof kids[0] === 'string';
  if (simple) return `<${open}>${kids[0]}</${tag}>`;

  const inner = kids
    .map((kid) => (isNode(kid) ? el(kid, name, attrs) : String(kid)))
    .join('\n');
  return `<${open}>\n${indent(inner, '  ')}\n</${tag}>`;
}

function wcEl(node: ExampleNode): string {
  const tag = wcTag(node.c);
  const a = wcAttrs(node.p);
  const open = a ? `${tag} ${a}` : tag;
  const kids = node.k ?? [];
  if (kids.length === 0) return `<${open}></${tag}>`;
  const simple = kids.length === 1 && typeof kids[0] === 'string';
  if (simple) return `<${open}>${kids[0]}</${tag}>`;
  const inner = kids.map((kid) => (isNode(kid) ? wcEl(kid) : String(kid))).join('\n');
  return `<${open}>\n${indent(inner, '  ')}\n</${tag}>`;
}

// ---------------------------------------------------------------------------
// Import collection
// ---------------------------------------------------------------------------

function collectReact(node: ExampleNode, set: Set<string>) {
  if (!isNative(node.c)) set.add(node.c.split('.')[0]);
  for (const k of node.k ?? []) if (isNode(k)) collectReact(k, set);
}
function collectVue(node: ExampleNode, set: Set<string>) {
  if (!isNative(node.c)) set.add(vueName(node.c));
  for (const k of node.k ?? []) if (isNode(k)) collectVue(k, set);
}

// ---------------------------------------------------------------------------
// Public: code for each framework
// ---------------------------------------------------------------------------

export function exampleCode(node: ExampleNode, framework: Framework): string {
  if (framework === 'react') {
    const names = new Set<string>();
    collectReact(node, names);
    const imp = `import { ${[...names].sort().join(', ')} } from '@lily-ui/react';`;
    return `${imp}\n\n${el(node, (c) => c, reactAttrs)}`;
  }
  if (framework === 'vue') {
    const names = new Set<string>();
    collectVue(node, names);
    const imp = `import { ${[...names].sort().join(', ')} } from '@lily-ui/vue';`;
    const markup = el(node, vueName, vueAttrs);
    return [
      `<script setup lang="ts">`,
      imp,
      `</script>`,
      ``,
      `<template>`,
      indent(markup, '  '),
      `</template>`,
    ].join('\n');
  }
  return `<!-- once per app: import '@lily-ui/web-components'; -->\n${wcEl(node)}`;
}
