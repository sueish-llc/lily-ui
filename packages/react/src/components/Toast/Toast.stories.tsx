import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './index';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Feedback/Toast',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Imperative, persistent toasts via the ToastProvider + useToast hook.' } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function Demo({ locale }: { locale: StoryLocale }) {
  const t = makeT(locale);
  const { toast } = useToast();
  return (
    <Button onClick={() => toast({ message: t('Saved successfully', '保存しました'), status: 'success' })}>
      {t('Show toast', 'トーストを表示')}
    </Button>
  );
}

export const Default: Story = {
  render: (_args, { globals }) => (
    <ToastProvider>
      <Demo locale={globals.locale as StoryLocale} />
    </ToastProvider>
  ),
};
