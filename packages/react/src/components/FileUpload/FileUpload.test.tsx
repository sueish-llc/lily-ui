import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from './FileUpload';

describe('FileUpload', () => {
  it('lists selected files and removes them', async () => {
    const onChange = vi.fn();
    render(<FileUpload multiple onChange={onChange} label="選択" />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    await userEvent.upload(input, file);
    expect(screen.getByText('hello.txt')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith([file]);
    await userEvent.click(screen.getByRole('button', { name: 'Remove hello.txt' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('has an operable dropzone button', () => {
    render(<FileUpload label="ここにドロップ" />);
    expect(screen.getByRole('button', { name: /ここにドロップ/ })).toBeInTheDocument();
  });
});
