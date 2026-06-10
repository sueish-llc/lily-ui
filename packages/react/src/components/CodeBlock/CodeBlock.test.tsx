import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock', () => {
  it('renders the root class', () => {
    const { container } = render(<CodeBlock>const x = 1;</CodeBlock>);
    expect(container.querySelector('.lily-code-block')).not.toBeNull();
  });

  it('renders code content from children', () => {
    render(<CodeBlock>const x = 1;</CodeBlock>);
    expect(screen.getByText('const x = 1;')).not.toBeNull();
  });

  it('renders code content from code prop', () => {
    render(<CodeBlock code="let y = 2;" />);
    expect(screen.getByText('let y = 2;')).not.toBeNull();
  });

  it('renders language label when provided', () => {
    render(<CodeBlock language="tsx">x</CodeBlock>);
    expect(screen.getByText('tsx')).not.toBeNull();
  });

  it('does not render header when language is absent and copyable is false', () => {
    const { container } = render(<CodeBlock copyable={false}>x</CodeBlock>);
    expect(container.querySelector('.lily-code-block__header')).toBeNull();
  });

  it('renders copy button by default', () => {
    const { container } = render(<CodeBlock>x</CodeBlock>);
    expect(container.querySelector('button')).not.toBeNull();
  });

  it('hides copy button when copyable is false', () => {
    const { container } = render(<CodeBlock copyable={false}>x</CodeBlock>);
    expect(container.querySelector('button')).toBeNull();
  });

  it('applies numbered modifier when showLineNumbers is true', () => {
    const { container } = render(<CodeBlock showLineNumbers>line one\nline two</CodeBlock>);
    expect(container.querySelector('.lily-code-block__pre--numbered')).not.toBeNull();
  });

  it('renders line numbers with the right count', () => {
    const { container } = render(
      <CodeBlock showLineNumbers code={'a\nb\nc'} />,
    );
    const numbers = container.querySelectorAll('.lily-code-block__line-number');
    expect(numbers).toHaveLength(3);
    expect(numbers[0]!.textContent).toBe('1');
    expect(numbers[2]!.textContent).toBe('3');
  });

  it('pre has tabIndex 0 for keyboard scrollability', () => {
    const { container } = render(<CodeBlock>x</CodeBlock>);
    const pre = container.querySelector('pre');
    expect(pre?.getAttribute('tabindex')).toBe('0');
  });

  it('merges className on the wrapper', () => {
    const { container } = render(<CodeBlock className="custom">x</CodeBlock>);
    expect(container.querySelector('.lily-code-block.custom')).not.toBeNull();
  });
});
