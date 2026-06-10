import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { useState } from 'react';
import { Collapse } from './Collapse';

function Demo({ defaultOpen }: { defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button aria-expanded={open} aria-controls="panel" onClick={() => setOpen((o) => !o)}>
        Toggle
      </button>
      <Collapse id="panel" open={open}>
        <p>Content</p>
      </Collapse>
    </div>
  );
}

describe('Collapse a11y', () => {
  it('has no violations when open (with an aria-expanded control)', async () => {
    const { container } = render(<Demo defaultOpen />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no violations when closed', async () => {
    const { container } = render(<Demo defaultOpen={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
