import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Meter } from './Meter';

describe('Meter', () => {
  it('exposes a meter role with value bounds', () => {
    render(<Meter label="ストレージ" value={75} valueText="75/100" showValue />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '75');
    expect(meter).toHaveAttribute('aria-valuetext', '75/100');
  });
});
