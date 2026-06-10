import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CommandPalette } from './CommandPalette';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

/** Wrapper so the story can own the open state (palette is a controlled overlay). */
function Demo({ locale }: { locale: StoryLocale }) {
  const t = makeT(locale);
  const [open, setOpen] = useState(false);
  const items = [
    { id: 'new', label: t('New', '新規作成'), group: t('File', 'ファイル'), shortcut: '⌘N' },
    { id: 'open', label: t('Open', '開く'), group: t('File', 'ファイル'), shortcut: '⌘O' },
    { id: 'settings', label: t('Settings', '設定'), group: t('Other', 'その他'), keywords: ['preferences'] },
    { id: 'theme', label: t('Toggle theme', 'テーマ切替'), group: t('Other', 'その他') },
  ];
  return (
    <div>
      <Button onClick={() => setOpen(true)}>{t('Open command palette (⌘K)', 'コマンドパレットを開く（⌘K）')}</Button>
      <CommandPalette open={open} onOpenChange={setOpen} onSelect={() => setOpen(false)} items={items} placeholder={t('Search commands…', 'コマンドを検索…')} />
    </div>
  );
}

const meta = {
  title: 'Overlay/Command Palette',
  component: CommandPalette,
  tags: ['autodocs'],
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = { render: (_args, { globals }) => <Demo locale={globals.locale as StoryLocale} /> };
