import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Icon } from './Icon';

describe('Icon a11y', () => {
  it('has no violations (labeled)', async () => {
    const { container } = render(
      <Icon label="検索" tone="primary">
        <svg viewBox="0 0 24 24" />
      </Icon>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
