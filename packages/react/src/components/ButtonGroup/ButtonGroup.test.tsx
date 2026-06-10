import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button';

describe('ButtonGroup', () => {
  it('is a labeled group', () => {
    render(
      <ButtonGroup label="Alignment">
        <Button>L</Button>
        <Button>R</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group', { name: 'Alignment' })).toBeInTheDocument();
  });
});
