/* The live, interactive component playground (mounted client-only).
 *
 * Left:  a live preview rendered from the real @lily-ui/react component —
 *        a curated demo when one exists, otherwise a generic prop-driven render.
 * Right: controls derived from the component's typed props.
 * Below: the equivalent source for React, Vue, and Web Components, regenerated
 *        live from the current prop state.
 *
 * Because all three packages emit identical markup, the React preview faithfully
 * represents the output of all three frameworks. */
import 'temporal-polyfill/global';
import * as React from 'react';
import * as Lily from '@lily-ui/react';
import { renderNode } from './ExampleView';
import { customExamples } from './customExamples';
import { exampleNodes } from '../registry/examples';
import { exampleCode } from '../lib/example';
import {
  generators,
  FRAMEWORK_LABELS,
  type Framework,
  type PropValue,
  type PropValues,
} from '../lib/codegen';
import type { PropControl } from '../registry/components.generated';

export interface PlaygroundProps {
  name: string;
  tag: string;
  controls: PropControl[];
  childrenText: string;
  labels: {
    preview: string;
    code: string;
    controls: string;
    copy: string;
    copied: string;
    noPreview: string;
  };
}

class PreviewBoundary extends React.Component<
  { fallback: React.ReactNode; resetKey: string; children: React.ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: false });
    }
  }
  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}

function defaultValues(controls: PropControl[]): PropValues {
  const out: PropValues = {};
  for (const c of controls) {
    if (c.default !== undefined) out[c.name] = c.default;
    else if (c.control === 'boolean') out[c.name] = false;
    else if (c.control === 'select' && c.options?.length) out[c.name] = c.options[0];
  }
  return out;
}

/** Strip falsy/empty values so we don't pass noise to the component. */
function cleanProps(values: PropValues): Record<string, PropValue> {
  const out: Record<string, PropValue> = {};
  for (const [k, v] of Object.entries(values)) {
    if (v === '' || v === undefined) continue;
    out[k] = v;
  }
  return out;
}

function LivePreview({
  name,
  values,
  childrenText,
  fallback,
}: {
  name: string;
  values: PropValues;
  childrenText: string;
  fallback: React.ReactNode;
}) {
  const props = cleanProps(values);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = (Lily as any)[name] as React.ElementType | undefined;

  const node: React.ReactNode = Comp
    ? React.createElement(Comp, props as object, childrenText || undefined)
    : fallback;

  return (
    <PreviewBoundary resetKey={JSON.stringify(values)} fallback={fallback}>
      {node}
    </PreviewBoundary>
  );
}

function Control({
  control,
  value,
  onChange,
}: {
  control: PropControl;
  value: PropValue | undefined;
  onChange: (v: PropValue) => void;
}) {
  const id = `pg-${control.name}`;
  if (control.control === 'boolean') {
    return (
      <div className="pg-control">
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor={id}>{control.name}</label>
      </div>
    );
  }
  if (control.control === 'select' && control.options?.length) {
    return (
      <div className="pg-control">
        <label htmlFor={id}>{control.name}</label>
        <select id={id} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>
          {control.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  }
  if (control.control === 'number') {
    return (
      <div className="pg-control">
        <label htmlFor={id}>{control.name}</label>
        <input
          id={id}
          type="number"
          value={String(value ?? '')}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
      </div>
    );
  }
  return (
    <div className="pg-control">
      <label htmlFor={id}>{control.name}</label>
      <input
        id={id}
        type="text"
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

const FRAMEWORKS: Framework[] = ['react', 'vue', 'wc'];

export default function Playground({
  name,
  tag,
  controls,
  childrenText,
  labels,
}: PlaygroundProps) {
  const [values, setValues] = React.useState<PropValues>(() => defaultValues(controls));
  const [framework, setFramework] = React.useState<Framework>('react');

  const setValue = (n: string, v: PropValue) => {
    setValues((prev) => ({ ...prev, [n]: v }));
  };

  // A fixed example (preview + code share one source) takes precedence — either
  // a hand-authored one (stateful overlays) or a declarative spec node;
  // otherwise fall back to the interactive controls + generic render.
  const custom = customExamples[name];
  const spec = !custom ? exampleNodes[name] : undefined;
  const isExample = Boolean(custom || spec);
  const showControls = !isExample && controls.length > 0;

  const code = custom
    ? custom[framework]
    : spec
      ? exampleCode(spec, framework)
      : generators[framework]({ component: { name, tag, controls }, values, children: childrenText });

  const fallback = <p className="pg-fallback">{labels.noPreview}</p>;

  return (
    <div className="pg">
      <div className="pg-stage">
        <div
          className={`pg-preview${isExample ? ' pg-preview--example' : ''}`}
          aria-label={labels.preview}
        >
          {custom ? (
            <PreviewBoundary resetKey={name} fallback={fallback}>
              {custom.render()}
            </PreviewBoundary>
          ) : spec ? (
            <PreviewBoundary resetKey={name} fallback={fallback}>
              {renderNode(spec)}
            </PreviewBoundary>
          ) : (
            <LivePreview
              name={name}
              values={values}
              childrenText={childrenText}
              fallback={fallback}
            />
          )}
        </div>
        {showControls && (
          <fieldset className="pg-controls">
            <legend>{labels.controls}</legend>
            {controls.map((c) => (
              <Control
                key={c.name}
                control={c}
                value={values[c.name]}
                onChange={(v) => setValue(c.name, v)}
              />
            ))}
          </fieldset>
        )}
      </div>

      <div className="pg-code">
        <div className="pg-tabs" role="group" aria-label={labels.code}>
          {FRAMEWORKS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={framework === f}
              className="pg-tab"
              onClick={() => setFramework(f)}
            >
              {FRAMEWORK_LABELS[f]}
            </button>
          ))}
        </div>
        <div className="pg-pre-wrap">
          <Lily.CopyButton
            className="pg-copy"
            value={code}
            copyLabel={labels.copy}
            copiedLabel={labels.copied}
            size="sm"
          />
          <pre className="pg-pre" aria-label={`${FRAMEWORK_LABELS[framework]} ${labels.code}`}>
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
