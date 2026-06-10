import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders status, title and dismiss', async () => {
    const onClose = vi.fn();
    render(
      <Alert status="success" title="Saved" onClose={onClose}>
        Body
      </Alert>,
    );
    expect(screen.getByRole('status')).toHaveAttribute('data-status', 'success');
    expect(screen.getByText('Saved')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('uses role=alert when requested', () => {
    render(
      <Alert status="danger" role="alert">
        Error
      </Alert>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
