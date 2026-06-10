import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from './HoverCard';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Overlay/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A floating card that reveals rich supplementary content when its trigger is hovered or focused. It opens after a short delay and closes on blur or Escape, so it works with the keyboard too. Unlike Popover it is informational, not a dialog.',
      },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ padding: 'var(--lily-space-16)' }}>
        <HoverCard
          content={
            <div style={{ maxWidth: 220 }}>
              <strong>@lily</strong>
              <p style={{ margin: 'var(--lily-space-1) 0 0' }}>
                {t('UI library for AI-friendly apps.', 'AI に優しい UI ライブラリ。')}
              </p>
            </div>
          }
        >
          <a href="#lily">@lily</a>
        </HoverCard>
      </div>
    );
  },
};

export const Placements: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    const body = t('Supplementary detail.', '補足の説明。');
    return (
      <div className="lily-flex lily-gap-6" style={{ padding: 'var(--lily-space-16)' }}>
        {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
          <HoverCard key={p} placement={p} content={<p style={{ margin: 0 }}>{body}</p>}>
            <button type="button">{p}</button>
          </HoverCard>
        ))}
      </div>
    );
  },
};
