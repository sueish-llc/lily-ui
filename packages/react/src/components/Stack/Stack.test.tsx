import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from './Stack';

describe('Stack', () => {
  it('renders vertical by default', () => {
    render(<Stack>x</Stack>);
    expect(screen.getByText('x')).toHaveClass('lily-vstack', 'lily-gap-3');
  });

  it('renders horizontal with custom gap', () => {
    render(
      <Stack direction="horizontal" gap="2">
        x
      </Stack>,
    );
    expect(screen.getByText('x')).toHaveClass('lily-hstack', 'lily-gap-2');
  });
});
