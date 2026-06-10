import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Pagination } from './Pagination';

describe('Pagination a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<Pagination count={5} page={2} onChange={() => {}} />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
