import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from './SegmentedControl';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Segmented Control',
  component: SegmentedControl,
  tags: ['autodocs'],
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

const getOptions = (locale: StoryLocale) => {
  const t = makeT(locale);
  return [
    { value: 'list', label: t('List', 'リスト') },
    { value: 'grid', label: t('Grid', 'グリッド') },
    { value: 'board', label: t('Board', 'ボード') },
  ];
};

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <SegmentedControl aria-label={t('View mode', '表示モード')} defaultValue="list" options={getOptions(globals.locale as StoryLocale)} />;
  },
};

export const Block: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <SegmentedControl block aria-label={t('View mode', '表示モード')} defaultValue="list" options={getOptions(globals.locale as StoryLocale)} />;
  },
};
