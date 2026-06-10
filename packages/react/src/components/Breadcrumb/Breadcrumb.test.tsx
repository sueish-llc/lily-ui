import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('marks the last item as current and links the rest', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Library', href: '/lib' },
          { label: 'Current' },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    const current = screen.getByText('Current');
    expect(current).toHaveAttribute('aria-current', 'page');
  });
});
