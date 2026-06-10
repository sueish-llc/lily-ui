import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { Avatar, AvatarGroup } from './Avatar';

describe('Avatar a11y', () => {
  it('has no violations (image + group)', async () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar name="Ada Lovelace" status="success" statusLabel="online" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Katherine Johnson" />
      </AvatarGroup>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
