import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  it('selects a swatch', async () => {
    const onChange = vi.fn();
    render(<ColorPicker aria-label="色" swatches={['#cd2e69', '#41549f']} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '#41549f' }));
    expect(onChange).toHaveBeenCalledWith('#41549f');
    expect(screen.getByRole('button', { name: '#41549f' })).toHaveAttribute('aria-pressed', 'true');
  });
});
