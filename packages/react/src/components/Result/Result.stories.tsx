import type { Meta, StoryObj } from '@storybook/react';
import { Result } from './Result';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Feedback/Result',
  component: Result,
  tags: ['autodocs'],
} satisfies Meta<typeof Result>;

export default meta;
type Story = StoryObj<typeof Result>;

export const Success: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Result
        status="success"
        title={t('Submitted successfully', '送信完了')}
        description={t('Your request has been received.', 'お問い合わせを受け付けました。')}
      >
        <Button status="primary">{t('Go home', 'トップへ戻る')}</Button>
      </Result>
    );
  },
};

export const Error: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Result
        status="error"
        title={t('Submission failed', '送信エラー')}
        description={t('Please check your input and try again.', '入力内容を確認してやり直してください。')}
      >
        <Button status="danger" variant="outline">{t('Try again', 'やり直す')}</Button>
      </Result>
    );
  },
};

export const Warning: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Result
        status="warning"
        title={t('Attention required', '注意が必要です')}
        description={t('Some items could not be processed.', '一部の項目を処理できませんでした。')}
      />
    );
  },
};

export const Info: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Result
        status="info"
        title={t('Maintenance scheduled', 'メンテナンスのお知らせ')}
        description={t('The service will be unavailable on Saturday from 2–4 AM.', '土曜日 2:00〜4:00 にメンテナンスを実施します。')}
      />
    );
  },
};

export const NotFound: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Result
        status="404"
        title={t('Page not found', 'ページが見つかりません')}
        description={t("The page you're looking for doesn't exist.", 'お探しのページは存在しません。')}
      >
        <Button status="primary">{t('Go home', 'トップへ戻る')}</Button>
      </Result>
    );
  },
};

export const Forbidden: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Result
        status="403"
        title={t('Access denied', 'アクセスが拒否されました')}
        description={t("You don't have permission to view this page.", 'このページを表示する権限がありません。')}
      />
    );
  },
};

export const ServerError: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Result
        status="500"
        title={t('Server error', 'サーバーエラー')}
        description={t('Something went wrong. Please try again later.', 'しばらく経ってからもう一度お試しください。')}
      >
        <Button status="neutral" variant="outline">{t('Reload', '再読み込み')}</Button>
      </Result>
    );
  },
};
