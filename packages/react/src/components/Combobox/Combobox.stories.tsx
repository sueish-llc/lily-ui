import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from './Combobox';
import { FormField } from '../FormField';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const prefectures = (locale: StoryLocale) => {
  const t = makeT(locale);
  return [
    { value: 'tokyo', label: t('Tokyo', '東京') },
    { value: 'osaka', label: t('Osaka', '大阪') },
    { value: 'kyoto', label: t('Kyoto', '京都') },
    { value: 'hokkaido', label: t('Hokkaido', '北海道') },
    { value: 'fukuoka', label: t('Fukuoka', '福岡') },
  ];
};

const meta = {
  title: 'Forms/Combobox',
  component: Combobox,
  tags: ['autodocs'],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const locale = globals.locale as StoryLocale;
    const t = makeT(locale);
    return (
      <div style={{ maxWidth: 320 }}>
        <Combobox
          options={prefectures(locale)}
          aria-label={t('Prefecture', '都道府県')}
          placeholder={t('Type to filter', '入力して絞り込み')}
          emptyText={t('No matches', '該当なし')}
        />
      </div>
    );
  },
};

export const InFormField: Story = {
  render: (_args, { globals }) => {
    const locale = globals.locale as StoryLocale;
    const t = makeT(locale);
    return (
      <div style={{ maxWidth: 320 }}>
        <FormField label={t('Prefecture', '都道府県')}>
          <Combobox options={prefectures(locale)} placeholder={t('Type to filter', '入力して絞り込み')} emptyText={t('No matches', '該当なし')} />
        </FormField>
      </div>
    );
  },
};
