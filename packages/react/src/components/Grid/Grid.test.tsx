import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Row } from './Row';
import { Col } from './Col';

describe('Row / Col', () => {
  it('applies gutter classes', () => {
    render(<Row gutter="4">x</Row>);
    expect(screen.getByText('x')).toHaveClass('lily-row', 'lily-g-4');
  });

  it('applies base and responsive span classes', () => {
    render(
      <Col span={12} md={6} lg={4}>
        col
      </Col>,
    );
    const el = screen.getByText('col');
    expect(el).toHaveClass('lily-col-12', 'lily-col-md-6', 'lily-col-lg-4');
  });

  it('defaults to equal-width column', () => {
    render(<Col>auto</Col>);
    expect(screen.getByText('auto')).toHaveClass('lily-col');
  });

  it('supports auto and offset', () => {
    render(
      <Col span="auto" offset={2}>
        a
      </Col>,
    );
    const el = screen.getByText('a');
    expect(el).toHaveClass('lily-col-auto', 'lily-offset-2');
  });
});
