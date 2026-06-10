import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Range } from './Range';
import { FormField } from '../FormField';

describe('Range', () => {
  it('renders a slider inheriting field wiring', () => {
    render(
      <FormField label="Volume">
        <Range min={0} max={10} defaultValue={5} />
      </FormField>,
    );
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toHaveAttribute('max', '10');
  });
});
