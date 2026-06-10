import type { Meta, StoryObj } from '@storybook/react';
import { Mark } from './Mark';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Typography/Mark',
  component: Mark,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['warning', 'success', 'info', 'danger', 'primary'] satisfies import('./Mark').MarkStatus[],
    },
  },
} satisfies Meta<typeof Mark>;

export default meta;
type Story = StoryObj<typeof Mark>;

/** Default warning highlight. */
export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <p>
        {t('Please read the ', '次の ')}
        <Mark>{t('important notice', '重要なお知らせ')}</Mark>
        {t(' before continuing.', 'をお読みください。')}
      </p>
    );
  },
};

/** All status variants. */
export const Statuses: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    const statuses = ['warning', 'success', 'info', 'danger', 'primary'] as const;
    return (
      <p style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'baseline' }}>
        {statuses.map((s) => (
          <Mark key={s} status={s}>
            {t(s, s)}
          </Mark>
        ))}
      </p>
    );
  },
};

/** Inside a paragraph — the highlight is decorative, text conveys meaning. */
export const InParagraph: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <p>
        {t(
          'The field ',
          'フィールド ',
        )}
        <Mark status="danger">{t('Email', 'メールアドレス')}</Mark>
        {t(' is required.', 'は必須項目です。')}
      </p>
    );
  },
};
