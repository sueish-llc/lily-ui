import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders the requested number of text lines, hidden from AT', () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.querySelectorAll('.lily-skeleton--text')).toHaveLength(3);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});
