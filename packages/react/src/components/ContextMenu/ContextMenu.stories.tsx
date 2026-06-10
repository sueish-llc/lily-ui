/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- demo trigger surfaces are focusable so keyboard users can open the menu */
import type { Meta, StoryObj } from '@storybook/react';
import { ContextMenu } from './ContextMenu';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Overlay/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A menu that opens at the pointer on right-click over its trigger area, and from the keyboard with Shift+F10 or the ContextMenu key. The menu uses the standard roving-focus key model (Arrow keys, Home/End, Enter to activate, Escape to close).',
      },
    },
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <ContextMenu
        menu={
          <>
            <ContextMenu.Item onSelect={() => {}}>{t('Cut', '切り取り')}</ContextMenu.Item>
            <ContextMenu.Item onSelect={() => {}}>{t('Copy', 'コピー')}</ContextMenu.Item>
            <ContextMenu.Item onSelect={() => {}}>{t('Paste', '貼り付け')}</ContextMenu.Item>
            <ContextMenu.Divider />
            <ContextMenu.Item disabled>{t('Rename', '名前を変更')}</ContextMenu.Item>
            <ContextMenu.Item onSelect={() => {}}>{t('Delete', '削除')}</ContextMenu.Item>
          </>
        }
      >
        <div
          tabIndex={0}
          style={{
            display: 'grid',
            placeItems: 'center',
            blockSize: 160,
            border: '1px dashed var(--lily-color-border-default)',
            borderRadius: 'var(--lily-radius-md)',
          }}
        >
          {t('Right-click here (or Shift+F10)', '右クリック（または Shift+F10）')}
        </div>
      </ContextMenu>
    );
  },
};
