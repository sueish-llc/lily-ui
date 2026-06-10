import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagInput } from './TagInput';

describe('TagInput', () => {
  it('adds a tag on Enter and removes the last on Backspace', async () => {
    const onChange = vi.fn();
    render(<TagInput aria-label="タグ" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'react{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['react']);
    expect(screen.getByText('react')).toBeInTheDocument();
    await userEvent.type(input, '{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('rejects duplicates when unique', async () => {
    const onChange = vi.fn();
    render(<TagInput aria-label="タグ" defaultValue={['a']} onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'a{Enter}');
    expect(onChange).not.toHaveBeenCalled();
  });
});
