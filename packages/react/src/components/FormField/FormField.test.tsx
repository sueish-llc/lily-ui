import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Select } from '../Select';

describe('FormField wiring', () => {
  it('associates label, help, and error with the control', () => {
    render(
      <FormField label="Email" help="No spam" error="Required" required>
        <Input type="email" />
      </FormField>,
    );
    const input = screen.getByLabelText(/Email/);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const describedby = input.getAttribute('aria-describedby') ?? '';
    // Both help and error ids are referenced.
    expect(describedby.split(' ').length).toBe(2);
    expect(screen.getByText('No spam')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('works with Select and Textarea', () => {
    render(
      <>
        <FormField label="Country">
          <Select>
            <option value="jp">Japan</option>
          </Select>
        </FormField>
        <FormField label="Bio">
          <Textarea />
        </FormField>
      </>,
    );
    expect(screen.getByLabelText('Country')).toHaveClass('lily-select');
    expect(screen.getByLabelText('Bio')).toHaveClass('lily-textarea');
  });
});
