import type { Meta, StoryObj } from '@storybook/react';
import { CodeBlock } from './CodeBlock';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Typography/Code Block',
  component: CodeBlock,
  tags: ['autodocs'],
  argTypes: {
    showLineNumbers: { control: 'boolean' },
    copyable: { control: 'boolean' },
    language: { control: 'text' },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof CodeBlock>;

const SAMPLE_TSX = `import { Button } from '@lily-ui/react';

export function Demo() {
  return (
    <Button status="primary" size="lg">
      保存する
    </Button>
  );
}`;

const SAMPLE_BASH = `pnpm install @lily-ui/react @lily-ui/css
pnpm build`;

/** Default: language label and copy button. */
export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <CodeBlock language="tsx" copyLabel={t('Copy', 'コピー')} copiedLabel={t('Copied', 'コピーしました')}>
        {SAMPLE_TSX}
      </CodeBlock>
    );
  },
};

/** With line numbers. */
export const WithLineNumbers: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <CodeBlock
        language="tsx"
        showLineNumbers
        copyLabel={t('Copy', 'コピー')}
        copiedLabel={t('Copied', 'コピーしました')}
      >
        {SAMPLE_TSX}
      </CodeBlock>
    );
  },
};

/** Shell command — no line numbers needed. */
export const Shell: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <CodeBlock language="bash" copyLabel={t('Copy', 'コピー')} copiedLabel={t('Copied', 'コピーしました')}>
        {SAMPLE_BASH}
      </CodeBlock>
    );
  },
};

/** Without the copy button. */
export const NoCopy: Story = {
  render: () => (
    <CodeBlock language="json" copyable={false}>
      {'{\n  "name": "@lily-ui/react"\n}'}
    </CodeBlock>
  ),
};
