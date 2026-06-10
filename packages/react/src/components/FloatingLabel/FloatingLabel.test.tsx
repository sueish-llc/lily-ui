import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FloatingLabel } from './FloatingLabel';
import { Input } from '../Input';

describe('FloatingLabel', () => {
  it('associates the floating label with the control', () => {
    render(
      <FloatingLabel label="Email">
        <Input type="email" />
      </FloatingLabel>,
    );
    expect(screen.getByLabelText('Email')).toHaveClass('lily-input');
  });
});
