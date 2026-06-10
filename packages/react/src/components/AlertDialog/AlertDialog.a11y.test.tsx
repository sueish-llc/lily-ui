import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { AlertDialog } from './AlertDialog';
import { Button } from '../Button';

describe('AlertDialog a11y', () => {
  it('has no violations when open', async () => {
    const { container } = render(
      <AlertDialog
        open
        onClose={vi.fn()}
        title="Delete this item?"
        status="danger"
        actions={
          <>
            <Button variant="ghost" onClick={vi.fn()}>
              Cancel
            </Button>
            <Button status="danger" onClick={vi.fn()}>
              Delete
            </Button>
          </>
        }
      >
        This action cannot be undone.
      </AlertDialog>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations when closed', async () => {
    const { container } = render(
      <AlertDialog open={false} onClose={vi.fn()} title="Delete?" status="danger">
        This action cannot be undone.
      </AlertDialog>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
