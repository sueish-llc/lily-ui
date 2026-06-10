import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from './ColorPicker';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Color Picker',
  component: ColorPicker,
  tags: ['autodocs'],
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <ColorPicker aria-label={t('Theme color', 'テーマ色')} defaultValue="#cd2e69" customLabel={t('Custom', 'カスタム')} />;
  },
};

export const SwatchesOnly: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <ColorPicker aria-label={t('Theme color', 'テーマ色')} defaultValue="#cd2e69" custom={false} />;
  },
};
