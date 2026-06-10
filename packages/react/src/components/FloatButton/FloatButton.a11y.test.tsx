import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { FloatButton, FloatButtonGroup } from './FloatButton';

describe('FloatButton a11y', () => {
  it('has no violations for a default float button', async () => {
    const { container } = render(
      <FloatButton aria-label="Scroll to top">↑</FloatButton>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations for different shapes and positions', async () => {
    const { container } = render(
      <div>
        <FloatButton shape="circle" position="bottom-right" aria-label="Circle action">
          ★
        </FloatButton>
        <FloatButton shape="square" position="top-left" aria-label="Square action">
          ✎
        </FloatButton>
      </div>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations for FloatButtonGroup (closed)', async () => {
    const { container } = render(
      <FloatButtonGroup
        trigger="+"
        triggerProps={{ 'aria-label': 'Open actions' }}
        position="bottom-right"
      >
        <FloatButton aria-label="Add note">📝</FloatButton>
        <FloatButton aria-label="Share">⬆</FloatButton>
      </FloatButtonGroup>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations for FloatButtonGroup (open)', async () => {
    const { container } = render(
      <FloatButtonGroup
        trigger="+"
        triggerProps={{ 'aria-label': 'Open actions' }}
        position="bottom-right"
      >
        <FloatButton aria-label="Add note">📝</FloatButton>
        <FloatButton aria-label="Share">⬆</FloatButton>
      </FloatButtonGroup>,
    );
    // Open the group
    const trigger = container.querySelector('[aria-expanded]') as HTMLButtonElement;
    fireEvent.click(trigger);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
