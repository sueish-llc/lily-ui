import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './Container';

describe('Container', () => {
  it('renders base container class', () => {
    render(<Container>x</Container>);
    expect(screen.getByText('x')).toHaveClass('lily-container');
  });

  it('applies width modifier', () => {
    render(<Container width="lg">x</Container>);
    expect(screen.getByText('x')).toHaveClass('lily-container--lg');
  });

  it('supports fluid', () => {
    render(<Container width="fluid">x</Container>);
    expect(screen.getByText('x')).toHaveClass('lily-container--fluid');
  });
});
