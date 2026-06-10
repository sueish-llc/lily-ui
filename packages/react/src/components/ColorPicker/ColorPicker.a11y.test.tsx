import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<ColorPicker aria-label="テーマ色" defaultValue="#cd2e69" />);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
