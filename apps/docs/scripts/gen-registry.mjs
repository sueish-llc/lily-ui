// Generates src/registry/components.generated.ts — the single source of truth
// for the docs catalog. It reads two things from the React package (the source
// of truth per CLAUDE.md):
//
//   1. the Storybook story title → category + display name;
//   2. the component's own Props interface + TSDoc → playground controls,
//      prop reference table, summary, and React usage examples.
//
// Parsing is syntactic (no type resolution) and tolerant: anything it can't read
// cleanly yields fewer controls, never a crash. Hand-authored Japanese prose and
// curated demos live alongside in src/registry/overrides.ts.

import { readFileSync, readdirSync, writeFileSync, statSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../..');
const componentsDir = join(repoRoot, 'packages/react/src/components');
const outDir = resolve(__dirname, '../src/registry');
const outFile = join(outDir, 'components.generated.ts');

// ---------------------------------------------------------------------------
// Low-level text helpers
// ---------------------------------------------------------------------------

/** Substring of a balanced block (handles nested delimiters, strings, and
 *  comments — an apostrophe in a doc comment must not read as a string start). */
function matchBalanced(src, open, openChar, closeChar) {
  let depth = 0;
  let inStr = null;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      if (end === -1) return null;
      i = end + 1; // loop increment steps past the '/'
      continue;
    }
    if (c === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i);
      if (nl === -1) return null;
      i = nl;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') inStr = c;
    else if (c === openChar) depth++;
    else if (c === closeChar) {
      depth--;
      if (depth === 0) return src.slice(open, i + 1);
    }
  }
  return null;
}

function extractQuoted(src, key) {
  const re = new RegExp(`\\b${key}\\s*:\\s*(['"\`])`);
  const m = re.exec(src);
  if (!m) return null;
  const quote = m[1];
  let out = '';
  for (let i = m.index + m[0].length; i < src.length; i++) {
    const c = src[i];
    if (c === '\\') {
      out += src[i + 1] ?? '';
      i++;
      continue;
    }
    if (c === quote) break;
    out += c;
  }
  return out.replace(/\s+/g, ' ').trim();
}

function kebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

// ---------------------------------------------------------------------------
// TSDoc parsing
// ---------------------------------------------------------------------------

/** Strip the leading-asterisk gutter from a TSDoc block, returning inner text. */
function cleanDocBlock(raw) {
  return raw
    .replace(/^\/\*\*/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\*?\s?/, ''))
    .join('\n')
    .trim();
}

/** First sentence / summary line of a doc block (before any @tag). */
function docSummary(docInner) {
  const beforeTags = docInner.split(/\n@|\n\s*@/)[0];
  return beforeTags
    .split('\n')
    .filter((l) => !l.trimStart().startsWith('@'))
    .join(' ')
    // Strip TSDoc markup that would otherwise render as literal characters in
    // the docs UI: {@link Symbol [Display]} → Display (or Symbol), **bold** → bold.
    .replace(/\{@link\s+([^}|]+?)(?:[|\s]+([^}]+))?\}/g, (_, sym, label) =>
      (label ? label.trim() : sym.trim().replace(/[#.].*$/, '')),
    )
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Pull the value of a @default tag from a member doc block. */
function docDefault(docInner) {
  const m = /@default\s+(.+)/.exec(docInner);
  if (!m) return undefined;
  let v = m[1].trim().replace(/[.,;]$/, '');
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  const sm = /^(['"`])([\s\S]*)\1$/.exec(v);
  if (sm) return sm[2];
  return undefined;
}

/** Extract fenced ```tsx code blocks from an @example section. */
function docExamples(docInner) {
  const out = [];
  const re = /```(?:tsx|jsx|ts|js)?\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(docInner))) {
    const code = m[1].replace(/\s+$/, '');
    if (code.trim()) out.push(code);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Type → control inference
// ---------------------------------------------------------------------------

/** Resolve one level of local `export type Alias = ...;` definitions. */
function collectTypeAliases(src) {
  const aliases = {};
  const re = /export\s+type\s+([A-Za-z_$][\w$]*)\s*=\s*([^;]+);/g;
  let m;
  while ((m = re.exec(src))) aliases[m[1]] = m[2].trim();
  return aliases;
}

const STRING_LITERAL = /(['"])((?:\\.|(?!\1).)*)\1/g;

/** Given a (possibly aliased) type string, infer a playground control. */
function inferControl(typeStr, aliases) {
  let t = typeStr.trim();
  // resolve a bare alias reference (one level)
  if (aliases[t]) t = aliases[t].trim();

  // collect string literal members
  const literals = [];
  let m;
  STRING_LITERAL.lastIndex = 0;
  while ((m = STRING_LITERAL.exec(t))) literals.push(m[2]);

  // remaining tokens once literals + separators removed
  const rest = t
    .replace(STRING_LITERAL, '')
    .replace(/[|()\s]/g, '')
    .replace(/null|undefined/g, '');

  if (/^boolean$/.test(t.replace(/\s/g, ''))) return { control: 'boolean' };
  if (literals.length >= 2 && rest === '') return { control: 'select', options: literals };
  if (literals.length === 1 && rest === '') return { control: 'select', options: literals };
  if (/^number$/.test(t.replace(/\s/g, ''))) return { control: 'number' };
  if (/^string$/.test(t.replace(/\s/g, ''))) return { control: 'text' };
  // boolean unioned with undefined etc.
  if (rest === 'boolean') return { control: 'boolean' };
  return null; // ReactNode, functions, Temporal, objects → not a simple control
}

/** Parse the members of an interface body `{ ... }`. */
function parseMembers(body, aliases) {
  const inner = body.slice(1, -1);
  const members = [];
  let i = 0;
  let pendingDoc = null;
  while (i < inner.length) {
    // whitespace
    if (/\s/.test(inner[i])) {
      i++;
      continue;
    }
    // doc comment
    if (inner.startsWith('/**', i)) {
      const end = inner.indexOf('*/', i);
      const raw = inner.slice(i, end + 2);
      pendingDoc = cleanDocBlock(raw);
      i = end + 2;
      continue;
    }
    // line comment
    if (inner.startsWith('//', i)) {
      const nl = inner.indexOf('\n', i);
      i = nl === -1 ? inner.length : nl + 1;
      continue;
    }
    // member: name(?)?: type ;
    const nameMatch = /^(readonly\s+)?([A-Za-z_$][\w$]*|'[^']*'|"[^"]*")\s*(\?)?\s*:/.exec(
      inner.slice(i),
    );
    if (!nameMatch) {
      i++;
      pendingDoc = null;
      continue;
    }
    const name = nameMatch[2].replace(/^['"]|['"]$/g, '');
    const optional = Boolean(nameMatch[3]);
    i += nameMatch[0].length;
    // read type until top-level ';'
    let depthAngle = 0;
    let depthParen = 0;
    let depthBrace = 0;
    let depthBracket = 0;
    let inStr = null;
    const start = i;
    for (; i < inner.length; i++) {
      const c = inner[i];
      if (inStr) {
        if (c === '\\') i++;
        else if (c === inStr) inStr = null;
        continue;
      }
      if (c === '"' || c === "'" || c === '`') inStr = c;
      else if (c === '<') depthAngle++;
      else if (c === '>') depthAngle = Math.max(0, depthAngle - 1);
      else if (c === '(') depthParen++;
      else if (c === ')') depthParen = Math.max(0, depthParen - 1);
      else if (c === '{') depthBrace++;
      else if (c === '}') depthBrace = Math.max(0, depthBrace - 1);
      else if (c === '[') depthBracket++;
      else if (c === ']') depthBracket = Math.max(0, depthBracket - 1);
      else if (
        (c === ';' || c === '\n') &&
        !depthAngle &&
        !depthParen &&
        !depthBrace &&
        !depthBracket
      ) {
        if (c === ';') break;
        // newline only terminates if the next non-space looks like a new member
        const ahead = inner.slice(i + 1).match(/^\s*(\/\*\*|\/\/|[A-Za-z_$'"])/);
        const tail = inner.slice(start, i).trim();
        if (ahead && tail.endsWith(';') === false && /[;}]/.test(tail) === false) {
          // keep scanning unless it's clearly a complete type
        }
        if (ahead) break;
      }
    }
    const typeStr = inner.slice(start, i).replace(/;$/, '').trim();
    i++; // skip terminator

    const doc = pendingDoc ?? '';
    pendingDoc = null;
    const inferred = inferControl(typeStr, aliases);
    members.push({
      name,
      optional,
      type: typeStr.replace(/\s+/g, ' '),
      description: docSummary(doc) || undefined,
      default: docDefault(doc),
      control: inferred?.control,
      options: inferred?.options,
    });
  }
  return members;
}

/** Find the primary Props interface body for a component. */
function findPropsInterface(src, name) {
  const candidates = [`${name}OwnProps`, `${name}Props`];
  for (const cand of candidates) {
    const re = new RegExp(`export\\s+interface\\s+${cand}\\b[^{]*`);
    const m = re.exec(src);
    if (m) {
      const braceStart = src.indexOf('{', m.index + m[0].length - 1);
      if (braceStart !== -1) {
        const body = matchBalanced(src, braceStart, '{', '}');
        if (body) return { iface: cand, body };
      }
    }
  }
  return null;
}

/** Component-level summary + examples: the TSDoc block *immediately* preceding
 *  the component declaration (not any earlier doc on a type alias). */
function findComponentDoc(src, name) {
  const declRe = new RegExp(
    `(?:export\\s+(?:const|function|class)\\s+${name}\\b|const\\s+${name}(?:Impl|Root)\\b|function\\s+${name}Impl\\b)`,
    'g',
  );
  let m;
  while ((m = declRe.exec(src))) {
    const before = src.slice(0, m.index);
    const docEnd = before.lastIndexOf('*/');
    if (docEnd === -1) continue;
    // only whitespace may sit between the doc block and the declaration
    if (before.slice(docEnd + 2).trim() !== '') continue;
    const docStart = before.lastIndexOf('/**', docEnd);
    if (docStart === -1) continue;
    const inner = cleanDocBlock(before.slice(docStart, docEnd + 2));
    return { summary: docSummary(inner) || undefined, examples: docExamples(inner) };
  }
  return { summary: undefined, examples: [] };
}

// ---------------------------------------------------------------------------
// Story scan (category + display name)
// ---------------------------------------------------------------------------

function readStoryMeta(folder) {
  const storyFile = readdirSync(folder).find((f) => f.endsWith('.stories.tsx'));
  if (!storyFile) return null;
  const src = readFileSync(join(folder, storyFile), 'utf8');
  const title = extractQuoted(src, 'title');
  if (!title) return null;
  const [category, ...rest] = title.split('/');
  return { title, category, displayName: rest.join(' / ') };
}

// ---------------------------------------------------------------------------
// Drive
// ---------------------------------------------------------------------------

const result = [];

for (const dir of readdirSync(componentsDir)) {
  const folder = join(componentsDir, dir);
  if (!statSync(folder).isDirectory()) continue;
  const story = readStoryMeta(folder);
  if (!story) continue;

  const compFile = join(folder, `${dir}.tsx`);
  let props = [];
  let componentSummary;
  let examples = [];
  try {
    const src = readFileSync(compFile, 'utf8');
    const aliases = collectTypeAliases(src);
    const iface = findPropsInterface(src, dir);
    if (iface) props = parseMembers(iface.body, aliases);
    const cdoc = findComponentDoc(src, dir);
    componentSummary = cdoc.summary;
    examples = cdoc.examples;
  } catch {
    // no component file (e.g. multi-file component) — keep story-only entry
  }

  // playground controls = props with an inferred control
  const controls = props
    .filter((p) => p.control)
    .map((p) => ({
      name: p.name,
      control: p.control,
      options: p.options,
      default: p.default,
    }));

  const id = kebab(dir);
  // Per CLAUDE.md the component set is mirrored across all three packages
  // (parity is a hard project invariant), so every component is available in
  // React, Vue, and Web Components. Genuine exceptions are flagged in overrides.
  const frameworks = { react: true, vue: true, wc: true };

  result.push({
    id,
    name: dir,
    displayName: story.displayName || dir,
    category: story.category,
    storyTitle: story.title,
    tag: `lily-${id}`,
    frameworks,
    summary: componentSummary,
    examples,
    props: props.map((p) => ({
      name: p.name,
      type: p.type,
      optional: p.optional,
      default: p.default,
      description: p.description,
    })),
    controls,
  });
}

// ---------------------------------------------------------------------------
// Providers (packages/react/src/providers/*.tsx)
// ---------------------------------------------------------------------------
// Providers ship no story file, so they don't come out of the loop above.
// They are catalogued under Foundations: the app-wide concerns (theme mode,
// motion tier) belong next to ThemeOverride and the foundation pages. They
// exist in React and Vue only — Web Components read the same `data-theme` /
// `data-motion` attribute contract directly, with no provider element.
const providersDir = join(repoRoot, 'packages/react/src/providers');
for (const file of readdirSync(providersDir)) {
  const m = file.match(/^([A-Z][A-Za-z0-9]*)\.tsx$/); // skips *.test.tsx etc.
  if (!m) continue;
  const name = m[1];
  const src = readFileSync(join(providersDir, file), 'utf8');
  const aliases = collectTypeAliases(src);
  const iface = findPropsInterface(src, name);
  const props = iface ? parseMembers(iface.body, aliases) : [];
  const cdoc = findComponentDoc(src, name);
  const displayName = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

  result.push({
    id: kebab(name),
    name,
    displayName,
    category: 'Foundations',
    storyTitle: `Foundations/${displayName}`,
    tag: `lily-${kebab(name)}`,
    frameworks: { react: true, vue: true, wc: false },
    summary: cdoc.summary,
    examples: cdoc.examples,
    props: props.map((p) => ({
      name: p.name,
      type: p.type,
      optional: p.optional,
      default: p.default,
      description: p.description,
    })),
    controls: [], // the playground shows the hand-authored example instead
  });
}

result.sort((a, b) => a.name.localeCompare(b.name));

const header = `// AUTO-GENERATED by scripts/gen-registry.mjs — do not edit by hand.
// Source: packages/react/src/components/*/ (Props interface + TSDoc + story title)
//         + packages/react/src/providers/*.tsx (catalogued under Foundations)
// Run \`pnpm --filter @lily-ui/docs gen\` to regenerate.

export interface PropControl {
  name: string;
  control: 'select' | 'boolean' | 'text' | 'number';
  options?: string[];
  default?: string | number | boolean;
}

export interface PropDoc {
  name: string;
  type: string;
  optional: boolean;
  default?: string | number | boolean;
  description?: string;
}

export interface GeneratedComponent {
  id: string;
  name: string;
  displayName: string;
  category: string;
  storyTitle: string;
  tag: string;
  frameworks: { react: boolean; vue: boolean; wc: boolean };
  summary?: string;
  examples: string[];
  props: PropDoc[];
  controls: PropControl[];
}

export const generatedComponents: GeneratedComponent[] = ${JSON.stringify(result, null, 2)};
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, header);

const withProps = result.filter((c) => c.props.length).length;
const withControls = result.filter((c) => c.controls.length).length;
const withSummary = result.filter((c) => c.summary).length;
console.log(
  `gen-registry: ${result.length} components | props:${withProps} controls:${withControls} summary:${withSummary}`,
);
