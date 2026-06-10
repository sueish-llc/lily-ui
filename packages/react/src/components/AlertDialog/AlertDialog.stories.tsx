import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from './AlertDialog';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Overlay/Alert Dialog',
  component: AlertDialog,
  tags: ['autodocs'],
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof AlertDialog>;

function Demo({ locale, status }: { locale: StoryLocale; status?: 'danger' | 'warning' | 'primary' }) {
  const t = makeT(locale);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button status={status ?? 'primary'} onClick={() => setOpen(true)}>
        {t('Open alert dialog', 'アラートダイアログを開く')}
      </Button>
      <AlertDialog
        open={open}
        onClose={() => setOpen(false)}
        title={t('Delete this item?', 'この項目を削除しますか？')}
        status={status ?? 'danger'}
        actions={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {t('Cancel', 'キャンセル')}
            </Button>
            <Button status={status ?? 'danger'} onClick={() => setOpen(false)}>
              {t('Delete', '削除')}
            </Button>
          </>
        }
      >
        {t(
          'This action cannot be undone. The item will be permanently removed.',
          'この操作は取り消せません。削除した項目は元に戻せません。',
        )}
      </AlertDialog>
    </>
  );
}

export const Default: Story = {
  render: (_args, { globals }) => <Demo locale={globals.locale as StoryLocale} status="danger" />,
};

export const Warning: Story = {
  render: (_args, { globals }) => <Demo locale={globals.locale as StoryLocale} status="warning" />,
};
