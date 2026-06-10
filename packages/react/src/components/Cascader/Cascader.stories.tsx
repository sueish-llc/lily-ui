import type { Meta, StoryObj } from '@storybook/react';
import { Cascader } from './Cascader';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Cascader',
  component: Cascader,
  tags: ['autodocs'],
} satisfies Meta<typeof Cascader>;

export default meta;
type Story = StoryObj<typeof Cascader>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Cascader
        aria-label={t('Region', '地域')}
        options={[
          {
            value: 'jp',
            label: t('Japan', '日本'),
            children: [
              {
                value: 'kanto',
                label: t('Kanto', '関東'),
                children: [
                  { value: 'tokyo', label: t('Tokyo', '東京') },
                  { value: 'kanagawa', label: t('Kanagawa', '神奈川') },
                ],
              },
              { value: 'kansai', label: t('Kansai', '関西'), children: [{ value: 'osaka', label: t('Osaka', '大阪') }] },
            ],
          },
          { value: 'us', label: t('USA', '米国'), children: [{ value: 'ca', label: 'California' }] },
        ]}
      />
    );
  },
};
