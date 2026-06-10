import type { Meta, StoryObj } from '@storybook/react';
import { FloatButton, FloatButtonGroup } from './FloatButton';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Actions/Float Button',
  component: FloatButton,
  tags: ['autodocs'],
} satisfies Meta<typeof FloatButton>;

export default meta;
type Story = StoryObj<typeof FloatButton>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ position: 'relative', minHeight: 200 }}>
        <FloatButton position="bottom-right" aria-label={t('Scroll to top', 'ページ先頭へ戻る')}>
          ↑
        </FloatButton>
      </div>
    );
  },
};

export const Shapes: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <FloatButton
          shape="circle"
          position="bottom-right"
          style={{ position: 'static' }}
          aria-label={t('Circle button', '丸ボタン')}
        >
          ✎
        </FloatButton>
        <FloatButton
          shape="square"
          position="bottom-right"
          style={{ position: 'static' }}
          aria-label={t('Square button', '四角ボタン')}
        >
          ✎
        </FloatButton>
      </div>
    );
  },
};

export const Statuses: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    const statuses = ['primary', 'danger', 'success', 'warning', 'neutral'] as const;
    return (
      <div style={{ display: 'flex', gap: 16 }}>
        {statuses.map((s) => (
          <FloatButton
            key={s}
            status={s}
            position="bottom-right"
            style={{ position: 'static' }}
            aria-label={t(`${s} action`, `${s} アクション`)}
          >
            ★
          </FloatButton>
        ))}
      </div>
    );
  },
};

export const Group: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ position: 'relative', minHeight: 240 }}>
        <FloatButtonGroup
          position="bottom-right"
          trigger="+"
          triggerProps={{ 'aria-label': t('Open actions', 'アクションを開く') }}
        >
          <FloatButton aria-label={t('Add note', 'メモを追加')} style={{ position: 'static' }}>
            📝
          </FloatButton>
          <FloatButton aria-label={t('Share', '共有')} style={{ position: 'static' }}>
            ⬆
          </FloatButton>
          <FloatButton aria-label={t('Settings', '設定')} style={{ position: 'static' }}>
            ⚙
          </FloatButton>
        </FloatButtonGroup>
      </div>
    );
  },
};
