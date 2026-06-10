import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Mark } from './Mark';

describe('Mark a11y', () => {
  it('has no violations with default status', async () => {
    const { container } = render(
      <p>
        Read the <Mark>important notice</Mark> before continuing.
      </p>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations with success status', async () => {
    const { container } = render(
      <p>
        Status: <Mark status="success">Approved</Mark>
      </p>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations with danger status', async () => {
    const { container } = render(
      <p>
        Field <Mark status="danger">Email</Mark> is required.
      </p>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations with info and primary status', async () => {
    const { container } = render(
      <p>
        <Mark status="info">info</Mark> and <Mark status="primary">primary</Mark>
      </p>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
