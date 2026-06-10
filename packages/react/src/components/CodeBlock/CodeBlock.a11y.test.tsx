import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { axeOptions } from '../../test/axe';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock a11y', () => {
  it('has no violations with default props', async () => {
    const { container } = render(
      <CodeBlock language="tsx" copyLabel="Copy" copiedLabel="Copied">
        {`const x = 1;`}
      </CodeBlock>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations with line numbers', async () => {
    const { container } = render(
      <CodeBlock language="bash" showLineNumbers copyLabel="Copy" copiedLabel="Copied">
        {'echo hello\necho world'}
      </CodeBlock>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations without a copy button', async () => {
    const { container } = render(
      <CodeBlock language="json" copyable={false}>
        {'{}'}
      </CodeBlock>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('has no violations without a header', async () => {
    const { container } = render(<CodeBlock copyable={false}>{'x'}</CodeBlock>);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
