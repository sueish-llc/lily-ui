import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider', () => {
  it('is a separator and supports orientation + label', () => {
    const { rerender } = render(<Divider />);
    expect(screen.getByRole('separator')).toHaveClass('lily-divider');

    rerender(<Divider orientation="vertical" />);
    const v = screen.getByRole('separator');
    expect(v).toHaveClass('lily-divider--vertical');
    expect(v).toHaveAttribute('aria-orientation', 'vertical');

    rerender(<Divider>または</Divider>);
    expect(screen.getByText('または')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toHaveClass('lily-divider--labeled');
  });
});
