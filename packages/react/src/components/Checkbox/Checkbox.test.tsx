import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('Checkbox toggles via its label', async () => {
    const onChange = vi.fn();
    render(<Checkbox label="Accept" onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Accept'));
    expect(onChange).toHaveBeenCalled();
  });
});
