import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Feedback/Empty State',
  component: EmptyState,
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <EmptyState
        title={t('Nothing here yet', 'まだ何もありません')}
        description={t('Create your first project to get started.', '最初のプロジェクトを作成して始めましょう。')}
      />
    );
  },
};

export const WithIconAndAction: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <EmptyState
        icon={<span style={{ fontSize: 48 }}>🗂️</span>}
        title={t('Nothing here yet', 'まだ何もありません')}
        description={t('Create your first project to get started.', '最初のプロジェクトを作成して始めましょう。')}
        actions={<Button status="primary">{t('Create', '作成する')}</Button>}
      />
    );
  },
};
