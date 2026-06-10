import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './Image';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Media/Image',
  component: Image,
  tags: ['autodocs'],
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof Image>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ width: 280 }}>
        <Image src="https://picsum.photos/480/270" alt={t('Sample image', 'サンプル画像')} ratio={16 / 9} rounded />
      </div>
    );
  },
};

export const Fallback: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ width: 280 }}>
        <Image
          src="https://invalid.example/none.jpg"
          alt={t('Broken image example', '壊れた画像の例')}
          ratio={16 / 9}
          rounded
          fallback={t('Could not load image', '画像を読み込めませんでした')}
        />
      </div>
    );
  },
};
