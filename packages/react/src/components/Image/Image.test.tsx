import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Image } from './Image';

describe('Image', () => {
  it('swaps to the fallback on error', () => {
    render(<Image src="/broken.jpg" alt="写真" fallback="読み込めません" />);
    fireEvent.error(screen.getByRole('img', { name: '写真' }));
    expect(screen.getByText('読み込めません')).toBeInTheDocument();
  });
});
