import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text, Heading } from './Typography';

describe('Text & Heading', () => {
  it('Text applies variant + tone and is polymorphic', () => {
    render(
      <Text as="span" variant="caption" tone="muted">
        補足
      </Text>,
    );
    const el = screen.getByText('補足');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('lily-text', 'lily-text--caption');
    expect(el).toHaveAttribute('data-tone', 'muted');
  });

  it('Heading renders the matching level and display scale', () => {
    render(
      <Heading level={1} display>
        ようこそ
      </Heading>,
    );
    const el = screen.getByRole('heading', { level: 1, name: 'ようこそ' });
    expect(el).toHaveClass('lily-heading', 'lily-heading--display');
  });
});
