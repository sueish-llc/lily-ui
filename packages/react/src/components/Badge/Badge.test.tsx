import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('applies status and modifiers', () => {
    render(
      <Badge status="danger" subtle pill>
        9
      </Badge>,
    );
    const el = screen.getByText('9');
    expect(el).toHaveClass('lily-badge', 'lily-badge--subtle', 'lily-badge--pill');
    expect(el).toHaveAttribute('data-status', 'danger');
  });
});
