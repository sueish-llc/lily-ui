import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeline } from './Timeline';

describe('Timeline', () => {
  it('renders an item per event', () => {
    render(<Timeline items={[{ title: 'A', status: 'success' }, { title: 'B' }]} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
