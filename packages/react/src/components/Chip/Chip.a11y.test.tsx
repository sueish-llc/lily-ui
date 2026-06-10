import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Chip } from './Chip';

describe('Chip a11y', () => {
  it('has no violations (status + removable)', async () => {
    const { container } = render(
      <div>
        <Chip status="info">React</Chip>
        <Chip onRemove={() => {}}>ada@example.com</Chip>
        <Chip clickable selected onClick={() => {}}>
          絞り込み
        </Chip>
      </div>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
