import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Link } from './Link';

describe('Link', () => {
  it('adds new-tab affordances when external', () => {
    render(
      <Link href="https://example.com" external>
        外部
      </Link>,
    );
    const a = screen.getByRole('link', { name: /外部/ });
    expect(a).toHaveClass('lily-link', 'lily-link--external');
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
