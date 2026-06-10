import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { CopyButton } from '../CopyButton/CopyButton';

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLPreElement>, 'children'> {
  /** The code string to display. Takes priority over children. */
  code?: string;
  /** Language label shown in the header bar (e.g. `'tsx'`, `'bash'`). */
  language?: string;
  /** Prepend 1-based line numbers. @default false */
  showLineNumbers?: boolean;
  /** Show a copy button in the header bar. @default true */
  copyable?: boolean;
  /** Accessible label for the copy button. @default 'Copy' */
  copyLabel?: string;
  /** Label shown after a successful copy. @default 'Copied' */
  copiedLabel?: string;
  /** Fallback when `code` is not provided. */
  children?: ReactNode;
}

const CLASS = 'lily-code-block';

/**
 * CodeBlock — a multi-line, block-level code display with optional language
 * label and one-click copy. Renders `<pre><code>` with monospace tokens.
 *
 * For inline code, use the existing `<Code>` component from `Kbd`.
 *
 * @example
 * ```tsx
 * <CodeBlock language="tsx" showLineNumbers>
 *   {source}
 * </CodeBlock>
 * ```
 */
export const CodeBlock = forwardRef<HTMLPreElement, CodeBlockProps>(function CodeBlock(
  {
    code,
    language,
    showLineNumbers = false,
    copyable = true,
    copyLabel = 'Copy',
    copiedLabel = 'Copied',
    className,
    children,
    ...rest
  },
  ref,
) {
  const content = code ?? (typeof children === 'string' ? children : '');
  const lines = content.split('\n');

  const hasHeader = !!(language || copyable);

  return (
    <div className={cx(CLASS, className)}>
      {hasHeader && (
        <div className={`${CLASS}__header`}>
          {language && (
            <span className={`${CLASS}__language`} aria-hidden="true">
              {language}
            </span>
          )}
          {copyable && (
            <CopyButton
              value={content}
              size="sm"
              copyLabel={copyLabel}
              copiedLabel={copiedLabel}
              className={`${CLASS}__copy`}
            />
          )}
        </div>
      )}
      {/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- focusable region so keyboard users can scroll long code */}
      <pre
        ref={ref}
        className={cx(`${CLASS}__pre`, showLineNumbers && `${CLASS}__pre--numbered`)}
        tabIndex={0}
        {...rest}
      >
        <code className={`${CLASS}__code`}>
          {showLineNumbers
            ? lines.map((line, i) => (
                <span key={i} className={`${CLASS}__line`}>
                  <span className={`${CLASS}__line-number`} aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className={`${CLASS}__line-content`}>{line}</span>
                </span>
              ))
            : content}
        </code>
      </pre>
    </div>
  );
});
