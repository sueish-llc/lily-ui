import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const Statuses: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div className="lily-vstack lily-gap-3">
        {(['primary', 'info', 'success', 'warning', 'danger'] as const).map((s) => (
          <Alert key={s} status={s} title={s}>
            {t(`This is a ${s} alert.`, `${s} のアラートです。`)}
          </Alert>
        ))}
      </div>
    );
  },
};

export const Dismissible: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Alert status="success" title={t('Dismissible', '閉じられます')} onClose={() => {}}>
        {t('With a close button.', '閉じるボタン付き。')}
      </Alert>
    );
  },
};
