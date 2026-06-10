import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Offcanvas } from './Offcanvas';

describe('Offcanvas', () => {
  it('renders a labeled dialog when open', () => {
    render(
      <Offcanvas open onClose={() => {}} title="Menu" placement="end">
        Content
      </Offcanvas>,
    );
    expect(screen.getByRole('dialog')).toHaveAccessibleName('Menu');
  });
});
