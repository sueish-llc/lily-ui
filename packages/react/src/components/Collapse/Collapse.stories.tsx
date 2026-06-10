import type { Meta, StoryObj } from '@storybook/react';
import { useState, type CSSProperties } from 'react';
import { Collapse } from './Collapse';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Disclosure/Collapse',
  component: Collapse,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'コンテンツの表示・非表示を高さのアニメーションで切り替えます。開閉の状態は open プロパティで渡します。切り替えるボタンには aria-expanded を付け、aria-controls でこの要素の id を指してください。',
      },
    },
  },
} satisfies Meta<typeof Collapse>;

export default meta;
type Story = StoryObj<typeof Collapse>;

const box: CSSProperties = {
  marginTop: 'var(--lily-space-4)',
  padding: 'var(--lily-space-6)',
  borderRadius: 'var(--lily-radius-lg)',
  background: 'var(--lily-color-bg-surface)',
  border: '1px solid var(--lily-color-border-default)',
  maxWidth: '24rem',
};

export const Basic: Story = {
  args: { open: true },
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    const Demo = () => {
      const [open, setOpen] = useState(true);
      return (
        <div>
          <Button
            aria-expanded={open}
            aria-controls="collapse-demo"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? t('Collapse', '閉じる') : t('Expand', '開く')}
          </Button>
          <Collapse {...args} id="collapse-demo" open={open}>
            <div style={box}>
              <p style={{ margin: 0, color: 'var(--lily-color-fg-muted)' }}>
                {t(
                  'The panel opens and closes by animating its height; once fully collapsed it is hidden from assistive technology too.',
                  'パネルは高さのアニメーションで開閉します。閉じきった後は支援技術からも隠れます。',
                )}
              </p>
            </div>
          </Collapse>
        </div>
      );
    };
    return <Demo />;
  },
};
