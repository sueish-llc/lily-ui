import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error';
export interface StepItem {
  label: string;
  description?: string;
  status?: StepStatus;
}

/**
 * `<lily-stepper>` — a sequence of steps for wizards / checkout. Steps are a
 * JSON `steps` attribute (`{ label, description?, status? }`).
 *
 * Attributes: `steps`, `active`, `orientation`, `complete-label`, `error-label`.
 */
export class LilyStepper extends LilyElement {
  static get observedAttributes(): string[] {
    return ['steps', 'active', 'orientation', 'complete-label', 'error-label'];
  }

  private parse(): StepItem[] {
    const raw = this.attr('steps');
    if (!raw) return [];
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? (p as StepItem[]) : [];
    } catch {
      return [];
    }
  }

  protected build(): BuildResult {
    const steps = this.parse();
    const active = this.numAttr('active', 0);
    const vertical = this.attr('orientation') === 'vertical';
    const completeLabel = this.attr('complete-label', 'completed')!;
    const errorLabel = this.attr('error-label', 'error')!;
    const statusOf = (i: number, s?: StepStatus): StepStatus =>
      s ?? (i < active ? 'complete' : i === active ? 'current' : 'upcoming');

    const root = h('div', {
      class: ['lily-stepper', vertical && 'lily-stepper--vertical'],
      attrs: { role: 'list' },
    });

    steps.forEach((step, i) => {
      if (i > 0) {
        root.appendChild(
          h('span', { class: ['lily-stepper__connector', vertical && 'lily-stepper__connector--vertical'], attrs: { 'aria-hidden': 'true' } }),
        );
      }
      const status = statusOf(i, step.status);
      const marker = status === 'complete' ? '✓' : status === 'error' ? '!' : String(i + 1);
      const stepEl = h('div', {
        class: ['lily-stepper__step', `lily-stepper__step--${status}`],
        attrs: { role: 'listitem', 'aria-current': status === 'current' ? 'step' : null },
      });
      stepEl.appendChild(h('span', { class: 'lily-stepper__marker', attrs: { 'aria-hidden': 'true' }, text: marker }));
      const content = h('span', { class: 'lily-stepper__content' });
      const label = h('span', { class: 'lily-stepper__label', text: step.label });
      if (status === 'complete') label.appendChild(h('span', { class: 'lily-visually-hidden', text: ` (${completeLabel})` }));
      if (status === 'error') label.appendChild(h('span', { class: 'lily-visually-hidden', text: ` (${errorLabel})` }));
      content.appendChild(label);
      if (step.description) content.appendChild(h('span', { class: 'lily-stepper__description', text: step.description }));
      stepEl.appendChild(content);
      root.appendChild(stepEl);
    });

    return { root, slot: null };
  }
}
