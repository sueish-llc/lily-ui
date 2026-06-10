import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Table } from './Table';

describe('Table a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <Table caption="Quarterly results">
        <thead>
          <tr>
            <th scope="col">Quarter</th>
            <th scope="col">Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Q1</td>
            <td>100</td>
          </tr>
        </tbody>
      </Table>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
