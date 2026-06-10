import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Carousel } from './Carousel';

describe('Carousel', () => {
  it('advances slides via controls', async () => {
    render(<Carousel label="Gallery" slides={[<div key="1">Slide 1</div>, <div key="2">Slide 2</div>]} />);
    const next = screen.getByRole('button', { name: 'Next slide' });
    const indicators = screen.getAllByRole('button', { name: /Go to slide/ });
    expect(indicators[0]).toHaveAttribute('aria-current', 'true');
    await userEvent.click(next);
    expect(indicators[1]).toHaveAttribute('aria-current', 'true');
  });
});
