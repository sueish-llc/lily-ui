import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { BackTop } from './BackTop';

describe('BackTop a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<BackTop label="トップへ戻る" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
