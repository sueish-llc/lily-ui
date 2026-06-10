import type { Meta, StoryObj } from '@storybook/react';
import { Kbd, Code } from './Kbd';
import { Text } from '../Typography';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Typography/Kbd & Code',
  component: Kbd,
  tags: ['autodocs'],
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Shortcut: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Text>
        <Kbd>⌘</Kbd> <Kbd>K</Kbd> {t('opens the command palette.', 'を押すとコマンドパレットが開きます。')}
      </Text>
    );
  },
};

export const InlineCode: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Text>
        {t('Run ', '')}
        <Code>pnpm dev</Code>
        {t('.', ' を実行してください。')}
      </Text>
    );
  },
};

export const BlockCode: Story = {
  render: () => <Code block>{`import { Button } from '@lily-ui/react';\n\n<Button>OK</Button>`}</Code>,
};
