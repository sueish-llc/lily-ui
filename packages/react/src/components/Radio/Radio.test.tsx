import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Radio } from './Radio';

describe('Radio', () => {
  it('Radio shares a group name', () => {
    render(
      <fieldset>
        <legend>Plan</legend>
        <Radio name="plan" value="a" label="A" />
        <Radio name="plan" value="b" label="B" />
      </fieldset>,
    );
    expect(screen.getByLabelText('A')).toHaveAttribute('name', 'plan');
    expect(screen.getByLabelText('B')).toHaveAttribute('type', 'radio');
  });
});
