import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Alert } from './Alert';

describe('Alert a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Alert status="info" title="Note">
        Body
      </Alert>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
