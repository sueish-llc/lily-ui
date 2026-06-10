import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toolbar } from './Toolbar';
import { Button } from '../Button';

function makeToolbar(orientation?: 'horizontal' | 'vertical') {
  return render(
    <Toolbar aria-label="Formatting" orientation={orientation}>
      <Button variant="ghost" size="sm">
        Bold
      </Button>
      <Button variant="ghost" size="sm">
        Italic
      </Button>
      <Button variant="ghost" size="sm">
        Underline
      </Button>
    </Toolbar>,
  );
}

describe('Toolbar', () => {
  it('renders role="toolbar"', () => {
    makeToolbar();
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('sets aria-label', () => {
    makeToolbar();
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-label', 'Formatting');
  });

  it('defaults to horizontal orientation', () => {
    makeToolbar();
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('sets vertical orientation', () => {
    makeToolbar('vertical');
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies base class', () => {
    makeToolbar();
    expect(screen.getByRole('toolbar')).toHaveClass('lily-toolbar');
  });

  it('applies vertical modifier class', () => {
    makeToolbar('vertical');
    expect(screen.getByRole('toolbar')).toHaveClass('lily-toolbar--vertical');
  });

  it('moves focus on ArrowRight', async () => {
    makeToolbar();
    const buttons = screen.getAllByRole('button');
    buttons[0]!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(buttons[1]);
  });

  it('moves focus on ArrowLeft', async () => {
    makeToolbar();
    const buttons = screen.getAllByRole('button');
    buttons[1]!.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('wraps on ArrowRight at the end', async () => {
    makeToolbar();
    const buttons = screen.getAllByRole('button');
    buttons[buttons.length - 1]!.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('moves focus to first item on Home', async () => {
    makeToolbar();
    const buttons = screen.getAllByRole('button');
    buttons[2]!.focus();
    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('moves focus to last item on End', async () => {
    makeToolbar();
    const buttons = screen.getAllByRole('button');
    buttons[0]!.focus();
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(buttons[buttons.length - 1]);
  });
});
