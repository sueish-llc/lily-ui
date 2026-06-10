import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Kbd, Code } from './Kbd';

describe('Kbd & Code', () => {
  it('render the right elements and classes', () => {
    const { container } = render(
      <p>
        <Kbd>K</Kbd>
        <Code>npm i</Code>
        <Code block>line</Code>
      </p>,
    );
    expect(container.querySelector('kbd')).toHaveClass('lily-kbd');
    expect(container.querySelectorAll('code')[0]).toHaveClass('lily-code');
    expect(container.querySelectorAll('code')[1]).toHaveClass('lily-code--block');
  });
});
