import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Mark } from './Mark';

describe('Mark', () => {
  it('renders a native mark element', () => {
    render(<Mark>highlight</Mark>);
    const el = screen.getByText('highlight');
    expect(el.tagName.toLowerCase()).toBe('mark');
  });

  it('applies the base class', () => {
    render(<Mark>x</Mark>);
    expect(screen.getByText('x')).toHaveClass('lily-mark');
  });

  it('defaults to warning status', () => {
    render(<Mark>x</Mark>);
    expect(screen.getByText('x')).toHaveClass('lily-mark--warning');
  });

  it('applies the given status modifier', () => {
    render(<Mark status="success">ok</Mark>);
    expect(screen.getByText('ok')).toHaveClass('lily-mark--success');
  });

  it('applies danger status', () => {
    render(<Mark status="danger">err</Mark>);
    expect(screen.getByText('err')).toHaveClass('lily-mark--danger');
  });

  it('applies info status', () => {
    render(<Mark status="info">note</Mark>);
    expect(screen.getByText('note')).toHaveClass('lily-mark--info');
  });

  it('applies primary status', () => {
    render(<Mark status="primary">brand</Mark>);
    expect(screen.getByText('brand')).toHaveClass('lily-mark--primary');
  });

  it('merges className', () => {
    render(<Mark className="custom">x</Mark>);
    expect(screen.getByText('x')).toHaveClass('lily-mark', 'custom');
  });

  it('forwards extra props to the mark element', () => {
    render(<Mark data-testid="my-mark">x</Mark>);
    expect(screen.getByTestId('my-mark')).not.toBeNull();
  });
});
