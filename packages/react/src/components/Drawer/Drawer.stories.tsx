import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from './Drawer';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['temporary', 'persistent', 'permanent'],
    },
    anchor: {
      control: 'inline-radio',
      options: ['left', 'right', 'top', 'bottom'],
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof Drawer>;

function Nav({ locale }: { locale: StoryLocale }) {
  const t = makeT(locale);
  return (
    <nav aria-label={t('Sections', 'セクション')}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.25rem' }}>
        <li><a href="#a">{t('Overview', '概要')}</a></li>
        <li><a href="#b">{t('Components', 'コンポーネント')}</a></li>
        <li><a href="#c">{t('Settings', '設定')}</a></li>
      </ul>
    </nav>
  );
}

/** Temporary overlay drawer toggled by a button. */
export const Temporary: Story = {
  render: (_args, { globals }) => {
    const locale = globals.locale as StoryLocale;
    const t = makeT(locale);
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>{t('Open drawer', 'ドロワーを開く')}</Button>
          <Drawer open={open} onClose={() => setOpen(false)} anchor="left" title={t('Menu', 'メニュー')}>
            <Nav locale={locale} />
          </Drawer>
        </>
      );
    }
    return <Demo />;
  },
};

/** Permanent drawer that stays in the layout (e.g. a desktop sidebar). */
export const Permanent: Story = {
  render: (_args, { globals }) => {
    const locale = globals.locale as StoryLocale;
    const t = makeT(locale);
    return (
      <div style={{ display: 'flex', minHeight: '14rem', border: '1px solid var(--lily-color-border-default)' }}>
        <Drawer variant="permanent" anchor="left" ariaLabel={t('Sections', 'セクション')}>
          <Nav locale={locale} />
        </Drawer>
        <main style={{ padding: 'var(--lily-space-4)' }}>{t('Main content', '本文')}</main>
      </div>
    );
  },
};

/** Persistent drawer that collapses, pushing the content aside. */
export const Persistent: Story = {
  render: (_args, { globals }) => {
    const locale = globals.locale as StoryLocale;
    const t = makeT(locale);
    function Demo() {
      const [open, setOpen] = useState(true);
      return (
        <div style={{ display: 'flex', minHeight: '14rem', border: '1px solid var(--lily-color-border-default)' }}>
          <Drawer variant="persistent" anchor="left" open={open} ariaLabel={t('Sections', 'セクション')}>
            <Nav locale={locale} />
          </Drawer>
          <main style={{ padding: 'var(--lily-space-4)' }}>
            <Button onClick={() => setOpen((v) => !v)}>
              {open ? t('Hide', '隠す') : t('Show', '表示')}
            </Button>
          </main>
        </div>
      );
    }
    return <Demo />;
  },
};
