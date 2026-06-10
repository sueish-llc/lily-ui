import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stepper } from './Stepper';

describe('Stepper', () => {
  it('derives statuses and marks the current step', () => {
    render(<Stepper active={1} steps={[{ label: 'カート' }, { label: '配送' }, { label: '確認' }]} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    // First step is complete → carries a check marker.
    expect(items[0]).toHaveClass('lily-stepper__step--complete');
  });
});
