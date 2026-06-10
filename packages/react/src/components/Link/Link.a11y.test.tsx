import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Link } from './Link';

describe('Link a11y', () => {
  it('has no violations', async () => {
    const { container } = render(
      <p>
        <Link href="/docs">ドキュメント</Link> と{' '}
        <Link href="https://example.com" external>
          外部サイト
        </Link>
      </p>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
