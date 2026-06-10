import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Cascader } from './Cascader';

const regions = [
  {
    value: 'jp',
    label: '日本',
    children: [
      { value: 'kanto', label: '関東', children: [{ value: 'tokyo', label: '東京' }] },
      { value: 'kansai', label: '関西' },
    ],
  },
  { value: 'us', label: 'USA' },
];

describe('Cascader', () => {
  it('reveals child columns as the path is chosen', async () => {
    const onChange = vi.fn();
    render(<Cascader aria-label="地域" options={regions} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /日本/ }));
    expect(onChange).toHaveBeenLastCalledWith(['jp']);
    // The second column now shows 関東 / 関西.
    await userEvent.click(screen.getByRole('button', { name: /関東/ }));
    expect(onChange).toHaveBeenLastCalledWith(['jp', 'kanto']);
    expect(screen.getByRole('button', { name: '東京' })).toBeInTheDocument();
  });
});
