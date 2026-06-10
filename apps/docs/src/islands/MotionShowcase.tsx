/* Interactive Foundations → Motion showcase. Lists the real animation and
 * effect catalogs from @lily-ui/react and applies the same classes the library
 * documents (`lily-animate--*`, `lily-fx--*`). Hover or click a tile to (re)play
 * it, and copy the exact class string with the copy button. */
import * as React from 'react';
import {
  ENTRANCE_ANIMATIONS,
  EXIT_ANIMATIONS,
  ATTENTION_ANIMATIONS,
  animationClass,
  HOVER_EFFECTS,
  TEXT_EFFECTS,
  BACKGROUND_EFFECTS,
  AMBIENT_EFFECTS,
  effectClass,
  CopyButton,
  type AnimationName,
  type EffectName,
} from '@lily-ui/react';

export interface MotionLabels {
  entrance: string;
  exit: string;
  attention: string;
  hover: string;
  text: string;
  background: string;
  ambient: string;
  replayAll: string;
  hoverHint: string;
  play: string;
  copy: string;
  copied: string;
}

function AnimTile({ name, burst, playLabel, copy, copied }: {
  name: AnimationName;
  burst: number;
  playLabel: string;
  copy: string;
  copied: string;
}) {
  const dotRef = React.useRef<HTMLSpanElement>(null);
  const cls = animationClass(name); // "lily-animate lily-animate--<name>"

  // Play once on demand: the dot stays visible at rest, briefly runs the
  // animation, then drops the classes again on animationend so exit animations
  // don't leave the dot stuck in their (hidden) end state.
  const play = React.useCallback(() => {
    const el = dotRef.current;
    if (!el) return;
    const names = cls.split(' ');
    el.classList.remove(...names);
    void el.offsetWidth; // force reflow so the animation can restart
    el.classList.add(...names);
  }, [cls]);

  // The group's "replay all" button bumps `burst`.
  React.useEffect(() => {
    if (burst > 0) play();
  }, [burst, play]);

  const cleanup = (e: React.AnimationEvent<HTMLSpanElement>) => {
    e.currentTarget.classList.remove(...cls.split(' '));
  };

  return (
    <div className="motion-tile">
      <button
        type="button"
        className="motion-tile__stage"
        onClick={play}
        onMouseEnter={play}
        aria-label={`${name} — ${playLabel}`}
      >
        <span ref={dotRef} className="motion-dot" onAnimationEnd={cleanup} />
      </button>
      <div className="motion-tile__meta">
        <code>{name}</code>
        <CopyButton value={cls} size="sm" copyLabel={copy} copiedLabel={copied} />
      </div>
    </div>
  );
}

function AnimGroup({ title, names, labels }: {
  title: string;
  names: readonly AnimationName[];
  labels: MotionLabels;
}) {
  const [burst, setBurst] = React.useState(0);
  return (
    <section className="motion-group">
      <div className="motion-group__head">
        <h3>{title}</h3>
        <span className="motion-count">{names.length}</span>
        <button type="button" className="motion-replay" onClick={() => setBurst((v) => v + 1)}>
          ↻ {labels.replayAll}
        </button>
      </div>
      <div className="motion-grid">
        {names.map((nm) => (
          <AnimTile key={nm} name={nm} burst={burst} playLabel={labels.play} copy={labels.copy} copied={labels.copied} />
        ))}
      </div>
    </section>
  );
}

function EffectTile({ name, kind, hint, copy, copied }: {
  name: EffectName;
  kind: 'text' | 'box';
  hint?: string;
  copy: string;
  copied: string;
}) {
  const cls = effectClass(name);
  return (
    <div className="motion-tile">
      <span className="motion-tile__stage">
        {kind === 'text' ? (
          <span className={`motion-fx-text ${cls}`}>あア Aa 彩</span>
        ) : (
          <span className={`motion-fx-box ${cls}`} />
        )}
      </span>
      <div className="motion-tile__meta">
        <code>{name}</code>
        <CopyButton value={cls} size="sm" copyLabel={copy} copiedLabel={copied} />
      </div>
      {hint && <span className="motion-hint">{hint}</span>}
    </div>
  );
}

export default function MotionShowcase({ labels }: { labels: MotionLabels }) {
  const fx = { copy: labels.copy, copied: labels.copied };
  return (
    <div className="motion">
      <AnimGroup title={labels.entrance} names={ENTRANCE_ANIMATIONS} labels={labels} />
      <AnimGroup title={labels.exit} names={EXIT_ANIMATIONS} labels={labels} />
      <AnimGroup title={labels.attention} names={ATTENTION_ANIMATIONS} labels={labels} />

      <section className="motion-group">
        <div className="motion-group__head"><h3>{labels.text}</h3></div>
        <div className="motion-grid">
          {TEXT_EFFECTS.map((e) => (
            <EffectTile key={e} name={e} kind="text" {...fx} />
          ))}
        </div>
      </section>

      <section className="motion-group">
        <div className="motion-group__head"><h3>{labels.hover}</h3></div>
        <div className="motion-grid">
          {HOVER_EFFECTS.map((e) => (
            <EffectTile key={e} name={e} kind="box" hint={labels.hoverHint} {...fx} />
          ))}
        </div>
      </section>

      <section className="motion-group">
        <div className="motion-group__head"><h3>{labels.ambient}</h3></div>
        <div className="motion-grid">
          {AMBIENT_EFFECTS.map((e) => (
            <EffectTile key={e} name={e} kind="box" {...fx} />
          ))}
        </div>
      </section>

      <section className="motion-group">
        <div className="motion-group__head"><h3>{labels.background}</h3></div>
        <div className="motion-grid motion-grid--wide">
          {BACKGROUND_EFFECTS.map((e) => (
            <div key={e} className="motion-tile">
              <span className={`motion-fx-panel ${effectClass(e)}`} />
              <div className="motion-tile__meta">
                <code>{e}</code>
                <CopyButton value={effectClass(e)} size="sm" {...fx} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
