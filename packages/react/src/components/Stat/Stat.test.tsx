import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stat } from './Stat';

describe('Stat', () => {
  it('shows value and a trend with non-color-only text', () => {
    render(<Stat label="売上" value="¥1.2M" delta="+12%" trend="up" />);
    expect(screen.getByText('¥1.2M')).toBeInTheDocument();
    expect(screen.getByText('increase:')).toBeInTheDocument();
  });
});
