import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders a native button by default', () => {
    render(<Button>Click</Button>);
    const btn = screen.getByRole('button', { name: 'Click' });
    expect(btn.tagName).toBe('BUTTON');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('calls onClick when activated', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled and non-interactive while loading', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('exposes an accessible loading label', () => {
    render(
      <Button loading loadingLabel="Saving">
        Save
      </Button>,
    );
    expect(screen.getByText('Saving')).toBeInTheDocument();
  });

  it('renders as an anchor with as="a"', () => {
    render(
      <Button as="a" href="/docs">
        Docs
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
  });

  it('applies variant, size and status classes/attributes', () => {
    render(
      <Button variant="outline" size="lg" status="danger">
        X
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('lily-button', 'lily-button--outline', 'lily-button--lg');
    expect(btn).toHaveAttribute('data-status', 'danger');
  });
});
