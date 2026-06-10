import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useAnimate } from './useAnimate';

function Box() {
  const { ref, play } = useAnimate<HTMLDivElement>();
  return (
    <div>
      <div data-testid="box" ref={ref} />
      <button onClick={() => void play('shake-x')}>play</button>
    </div>
  );
}

describe('useAnimate', () => {
  it('applies the animation classes and clears them when it ends', async () => {
    render(<Box />);
    const box = screen.getByTestId('box');

    fireEvent.click(screen.getByRole('button', { name: 'play' }));
    expect(box).toHaveClass('lily-animate', 'lily-animate--shake-x');
    expect(box.style.willChange).toBe('transform, opacity');

    await act(async () => {
      fireEvent.animationEnd(box);
    });
    expect(box).not.toHaveClass('lily-animate--shake-x');
    expect(box.style.willChange).toBe('');
  });
});
