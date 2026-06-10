import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  it('renders a native fieldset element', () => {
    render(<Fieldset legend="Address">content</Fieldset>);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('renders the legend text', () => {
    render(<Fieldset legend="Shipping address">content</Fieldset>);
    expect(screen.getByText('Shipping address')).toBeInTheDocument();
  });

  it('applies base class', () => {
    render(<Fieldset legend="x">y</Fieldset>);
    expect(screen.getByRole('group')).toHaveClass('lily-fieldset');
  });

  it('applies legend class', () => {
    render(<Fieldset legend="x">y</Fieldset>);
    expect(screen.getByText('x')).toHaveClass('lily-fieldset__legend');
  });

  it('renders description when provided', () => {
    render(<Fieldset legend="x" description="Enter your shipping details">y</Fieldset>);
    expect(screen.getByText('Enter your shipping details')).toHaveClass('lily-fieldset__description');
  });

  it('does not render description element when omitted', () => {
    render(<Fieldset legend="x">y</Fieldset>);
    expect(screen.queryByRole('paragraph')).toBeNull();
  });

  it('disables the fieldset when disabled is true', () => {
    render(
      <Fieldset legend="x" disabled>
        <input type="text" />
      </Fieldset>,
    );
    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeDisabled();
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('forwards className', () => {
    render(<Fieldset legend="x" className="custom">y</Fieldset>);
    expect(screen.getByRole('group')).toHaveClass('lily-fieldset', 'custom');
  });

  it('forwards extra props to the fieldset element', () => {
    render(<Fieldset legend="x" id="my-group">y</Fieldset>);
    expect(screen.getByRole('group')).toHaveAttribute('id', 'my-group');
  });
});
