import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('is decorative by default and labeled when given a label', () => {
    const { rerender, container } = render(
      <Icon>
        <svg />
      </Icon>,
    );
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');

    rerender(
      <Icon label="検索" tone="primary" size="lg">
        <svg />
      </Icon>,
    );
    const el = screen.getByRole('img', { name: '検索' });
    expect(el).toHaveClass('lily-icon', 'lily-icon--lg');
    expect(el).toHaveAttribute('data-tone', 'primary');
  });
});
