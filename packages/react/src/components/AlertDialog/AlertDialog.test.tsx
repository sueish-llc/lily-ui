import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertDialog } from './AlertDialog';

function Wrapper({ open = true, onClose = vi.fn() }: { open?: boolean; onClose?: () => void }) {
  return (
    <AlertDialog
      open={open}
      onClose={onClose}
      title="Confirm delete"
      status="danger"
      actions={
        <>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button">Delete</button>
        </>
      }
    >
      This action cannot be undone.
    </AlertDialog>
  );
}

describe('AlertDialog', () => {
  it('renders nothing when closed', () => {
    render(<Wrapper open={false} />);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('renders role="alertdialog" with aria-modal when open', () => {
    render(<Wrapper />);
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('labels the dialog with the title', () => {
    render(<Wrapper />);
    expect(screen.getByRole('alertdialog')).toHaveAccessibleName('Confirm delete');
  });

  it('describes the dialog with body text', () => {
    render(<Wrapper />);
    const dialog = screen.getByRole('alertdialog');
    const descId = dialog.getAttribute('aria-describedby');
    expect(descId).toBeTruthy();
    const descEl = document.getElementById(descId!);
    expect(descEl?.textContent).toContain('cannot be undone');
  });

  it('does not close on backdrop click', async () => {
    const onClose = vi.fn();
    render(<Wrapper onClose={onClose} />);
    // Click outside the dialog (on the backdrop wrapper)
    await userEvent.click(document.body);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose on Escape', async () => {
    const onClose = vi.fn();
    render(<Wrapper onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('applies status modifier class', () => {
    render(<Wrapper />);
    expect(screen.getByRole('alertdialog')).toHaveClass('lily-alert-dialog--danger');
  });

  it('does not apply modifier for neutral status', () => {
    render(
      <AlertDialog open onClose={vi.fn()} title="Info" status="neutral">
        Message
      </AlertDialog>,
    );
    expect(screen.getByRole('alertdialog')).not.toHaveClass('lily-alert-dialog--neutral');
  });

  it('renders actions in the footer', () => {
    render(<Wrapper />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });
});
