import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './ScrollArea';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Layout/Scroll Area',
  component: ScrollArea,
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <ScrollArea maxHeight={160} style={{ maxWidth: 280, border: '1px solid var(--lily-color-border-default)', padding: 12 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i}>
            {t('Row', '行')} {i + 1}
          </p>
        ))}
      </ScrollArea>
    );
  },
};
