import type { Meta, StoryObj } from '@storybook/react';
import { Text, Heading } from './Typography';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Typography/Text & Heading',
  component: Text,
  tags: ['autodocs'],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof Text>;

export const Headings: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div className="lily-vstack lily-gap-2">
        <Heading level={1} display>
          {t('Display heading', 'ディスプレイ見出し')}
        </Heading>
        <Heading level={1}>Heading 1</Heading>
        <Heading level={2}>Heading 2</Heading>
        <Heading level={3}>Heading 3</Heading>
        <Heading level={2} gradient>
          {t('Gradient heading', 'グラデーション見出し')}
        </Heading>
      </div>
    );
  },
};

export const TextVariants: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div className="lily-vstack lily-gap-2" style={{ maxWidth: 520 }}>
        <Text variant="lead">{t('Lead: an intro sentence with relaxed leading.', 'リード文：導入の一文をゆったりとした行間で。')}</Text>
        <Text>{t('Body text, optimized for Japanese typography.', '本文テキスト。日本語の組版に最適化されています。')}</Text>
        <Text variant="small">{t('Small text', 'スモールテキスト')}</Text>
        <Text variant="caption" tone="muted">
          {t('Caption / note', 'キャプション・補足')}
        </Text>
        <Text variant="overline" tone="subtle">
          OVERLINE
        </Text>
      </div>
    );
  },
};

export const Tones: Story = {
  render: () => (
    <div className="lily-vstack lily-gap-1">
      {(['default', 'muted', 'subtle', 'primary', 'accent', 'danger', 'success', 'warning', 'info'] as const).map((tone) => (
        <Text key={tone} tone={tone}>
          {`tone="${tone}"`}
        </Text>
      ))}
    </div>
  ),
};
