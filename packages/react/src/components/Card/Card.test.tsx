import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('composes header/body/footer/title', () => {
    render(
      <Card elevated>
        <Card.Header>H</Card.Header>
        <Card.Body>
          <Card.Title>T</Card.Title>
          B
        </Card.Body>
        <Card.Footer>F</Card.Footer>
      </Card>,
    );
    expect(screen.getByText('H')).toHaveClass('lily-card__header');
    expect(screen.getByText('T')).toHaveClass('lily-card__title');
    expect(screen.getByText('F')).toHaveClass('lily-card__footer');
  });
});
