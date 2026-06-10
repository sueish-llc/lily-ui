import { forwardRef, Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error';

export interface StepItem {
  /** Step label. */
  label: ReactNode;
  /** Optional supporting text. */
  description?: ReactNode;
  /** Override the status (otherwise derived from `active`). */
  status?: StepStatus;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The steps in order. */
  steps: StepItem[];
  /** Index of the current step (drives derived statuses). @default 0 */
  active?: number;
  /** Layout direction. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** SR text appended for completed steps. @default 'completed' */
  completeLabel?: string;
  /** SR text appended for errored steps. @default 'error' */
  errorLabel?: string;
}

/**
 * Stepper — a sequence of steps for wizards / checkout. The current step gets
 * `aria-current="step"`; completed/errored steps carry a check / "!" marker plus
 * visually-hidden status text, so state is never color-only.
 *
 * @example
 * ```tsx
 * <Stepper active={1} steps={[{ label: 'カート' }, { label: '配送' }, { label: '確認' }]} />
 * ```
 */
export const Stepper = forwardRef<HTMLDivElement, StepperProps>(function Stepper(
  { steps, active = 0, orientation = 'horizontal', completeLabel = 'completed', errorLabel = 'error', className, ...rest },
  ref,
) {
  const statusOf = (i: number, s?: StepStatus): StepStatus =>
    s ?? (i < active ? 'complete' : i === active ? 'current' : 'upcoming');

  return (
    <div
      ref={ref}
      className={cx('lily-stepper', orientation === 'vertical' && 'lily-stepper--vertical', className)}
      role="list"
      {...rest}
    >
      {steps.map((step, i) => {
        const status = statusOf(i, step.status);
        const marker = status === 'complete' ? '✓' : status === 'error' ? '!' : i + 1;
        return (
          <Fragment key={i}>
            {i > 0 && (
              <span
                className={cx('lily-stepper__connector', orientation === 'vertical' && 'lily-stepper__connector--vertical')}
                aria-hidden="true"
              />
            )}
            <div
              className={cx('lily-stepper__step', `lily-stepper__step--${status}`)}
              role="listitem"
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <span className="lily-stepper__marker" aria-hidden="true">
                {marker}
              </span>
              <span className="lily-stepper__content">
                <span className="lily-stepper__label">
                  {step.label}
                  {status === 'complete' && <span className="lily-visually-hidden"> ({completeLabel})</span>}
                  {status === 'error' && <span className="lily-visually-hidden"> ({errorLabel})</span>}
                </span>
                {step.description && <span className="lily-stepper__description">{step.description}</span>}
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
});
