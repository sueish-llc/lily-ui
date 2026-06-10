import type { Meta, StoryObj } from '@storybook/react';
import { useState, type CSSProperties } from 'react';
import { Presence } from './Presence';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Disclosure/Presence',
  component: Presence,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '子要素の表示・非表示をアニメーション付きで切り替えます。消えるアニメーションが終わるまで要素を DOM に残し、終わってから取り除きます。動きを控える設定のときは、それに合わせて簡略にします。',
      },
    },
  },
} satisfies Meta<typeof Presence>;

export default meta;
type Story = StoryObj<typeof Presence>;

const box: CSSProperties = {
  marginTop: 'var(--lily-space-4)',
  padding: 'var(--lily-space-6)',
  borderRadius: 'var(--lily-radius-lg)',
  background: 'var(--lily-color-bg-surface)',
  border: '1px solid var(--lily-color-border-default)',
  boxShadow: 'var(--lily-shadow-md)',
  maxWidth: '24rem',
};

export const Basic: Story = {
  args: { enter: 'zoom-in', exit: 'zoom-out' },
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    const Demo = () => {
      const [open, setOpen] = useState(true);
      return (
        <div>
          <Button onClick={() => setOpen((o) => !o)}>
            {open ? t('Hide', '隠す') : t('Show', '表示する')}
          </Button>
          <Presence {...args} present={open}>
            <div style={box}>
              <strong>{t('Hello', 'こんにちは')}</strong>
              <p style={{ margin: 0, color: 'var(--lily-color-fg-muted)' }}>
                {t(
                  'Toggle with the button; the element is removed only after the exit animation finishes.',
                  'ボタンで開閉すると、退場アニメーションが終わってから取り除かれます。',
                )}
              </p>
            </div>
          </Presence>
        </div>
      );
    };
    return <Demo />;
  },
};
