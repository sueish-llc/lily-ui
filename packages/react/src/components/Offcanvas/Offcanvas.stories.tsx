import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Offcanvas } from './Offcanvas';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Overlay/Offcanvas',
  component: Offcanvas,
  tags: ['autodocs'],
} satisfies Meta<typeof Offcanvas>;

export default meta;
type Story = StoryObj<typeof Offcanvas>;

function Demo({ locale }: { locale: StoryLocale }) {
  const t = makeT(locale);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('Open offcanvas', 'オフキャンバスを開く')}</Button>
      <Offcanvas open={open} onClose={() => setOpen(false)} placement="end" title={t('Menu', 'メニュー')}>
        {t('Offcanvas content', 'オフキャンバスの内容')}
      </Offcanvas>
    </>
  );
}

export const Default: Story = { render: (_args, { globals }) => <Demo locale={globals.locale as StoryLocale} /> };
