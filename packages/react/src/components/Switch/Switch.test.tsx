import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('Switch has role=switch', () => {
    render(<Switch label="On" />);
    expect(screen.getByRole('switch', { name: 'On' })).toBeInTheDocument();
  });
});
