import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ListGroup } from './ListGroup';

describe('ListGroup', () => {
  it('applies active/disabled/action states', () => {
    render(
      <ListGroup>
        <ListGroup.Item active>A</ListGroup.Item>
        <ListGroup.Item action>B</ListGroup.Item>
        <ListGroup.Item disabled>C</ListGroup.Item>
      </ListGroup>,
    );
    expect(screen.getByText('A')).toHaveAttribute('aria-current', 'true');
    expect(screen.getByText('B')).toHaveClass('lily-list-group__item--action');
    expect(screen.getByText('C')).toHaveAttribute('aria-disabled', 'true');
  });
});
