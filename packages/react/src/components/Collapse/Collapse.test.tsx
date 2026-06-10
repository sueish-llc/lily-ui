import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Collapse } from './Collapse';

describe('Collapse', () => {
  it('shows its content when open', () => {
    render(
      <Collapse open data-testid="panel">
        content
      </Collapse>,
    );
    expect(screen.getByTestId('panel')).not.toHaveAttribute('hidden');
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('is hidden when closed', () => {
    render(
      <Collapse open={false} data-testid="panel">
        content
      </Collapse>,
    );
    expect(screen.getByTestId('panel')).toHaveAttribute('hidden');
  });

  it('reveals the content when toggled open', () => {
    const { rerender } = render(
      <Collapse open={false} data-testid="panel">
        content
      </Collapse>,
    );
    rerender(
      <Collapse open data-testid="panel">
        content
      </Collapse>,
    );
    expect(screen.getByTestId('panel')).not.toHaveAttribute('hidden');
  });

  it('applies the base class, merges className, and forwards ref + props', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Collapse open ref={ref} className="extra" id="faq-panel" data-testid="panel">
        content
      </Collapse>,
    );
    const el = screen.getByTestId('panel');
    expect(el).toHaveClass('lily-collapse', 'extra');
    expect(el).toHaveAttribute('id', 'faq-panel');
    expect(ref.current).toBe(el);
  });
});
