import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table } from './Table';

describe('Table', () => {
  it('applies modifiers and renders a caption', () => {
    render(
      <Table striped hover caption="Users">
        <tbody>
          <tr>
            <td>Ada</td>
          </tr>
        </tbody>
      </Table>,
    );
    const table = screen.getByRole('table');
    expect(table).toHaveClass('lily-table', 'lily-table--striped', 'lily-table--hover');
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('wraps in a responsive container when requested', () => {
    const { container } = render(
      <Table responsive>
        <tbody>
          <tr>
            <td>x</td>
          </tr>
        </tbody>
      </Table>,
    );
    expect(container.firstElementChild).toHaveClass('lily-table-responsive');
  });
});
