import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof Modal>;

function Demo({ locale }: { locale: StoryLocale }) {
  const t = makeT(locale);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('Open modal', 'モーダルを開く')}</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t('Confirm action', '操作の確認')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {t('Cancel', 'キャンセル')}
            </Button>
            <Button onClick={() => setOpen(false)}>{t('Confirm', '確認')}</Button>
          </>
        }
      >
        {t('Are you sure you want to continue?', '続行してもよろしいですか？')}
      </Modal>
    </>
  );
}

export const Default: Story = { render: (_args, { globals }) => <Demo locale={globals.locale as StoryLocale} /> };
