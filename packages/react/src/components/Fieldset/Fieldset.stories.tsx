import type { Meta, StoryObj } from '@storybook/react';
import { Fieldset } from './Fieldset';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof Fieldset>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Fieldset
        legend={t('Contact details', '連絡先')}
        description={t(
          'Fill in at least one way for us to reach you.',
          'ご連絡できる方法を少なくとも一つご記入ください。',
        )}
      >
        <label>
          {t('Email', 'メールアドレス')}
          <input type="email" />
        </label>
        <label>
          {t('Phone', '電話番号')}
          <input type="tel" />
        </label>
      </Fieldset>
    );
  },
};

export const Disabled: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Fieldset legend={t('Billing address', '請求先住所')} disabled>
        <label>
          {t('Street', '番地・建物名')}
          <input type="text" />
        </label>
        <label>
          {t('City', '市区町村')}
          <input type="text" />
        </label>
      </Fieldset>
    );
  },
};
