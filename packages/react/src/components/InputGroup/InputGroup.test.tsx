import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InputGroup } from './InputGroup';
import { Input } from '../Input';

describe('InputGroup', () => {
  it('renders addon and control', () => {
    render(
      <InputGroup>
        <InputGroup.Addon>@</InputGroup.Addon>
        <Input aria-label="Username" />
      </InputGroup>,
    );
    expect(screen.getByText('@')).toHaveClass('lily-input-group__addon');
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });
});
