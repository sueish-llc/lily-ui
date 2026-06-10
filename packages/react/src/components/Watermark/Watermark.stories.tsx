import type { Meta, StoryObj } from '@storybook/react';
import { Watermark } from './Watermark';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Media/Watermark',
  component: Watermark,
  tags: ['autodocs'],
  argTypes: {
    rotate: { control: { type: 'range', min: -90, max: 90, step: 1 } },
    opacity: { control: { type: 'range', min: 0, max: 0.5, step: 0.01 } },
  },
} satisfies Meta<typeof Watermark>;

export default meta;
type Story = StoryObj<typeof Watermark>;

const boxStyle = { padding: '2rem', border: '1px solid var(--lily-color-border-default)', borderRadius: '8px' };

/** Default: tiled text watermark. */
export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Watermark text={t('Confidential', '社外秘')}>
        <div style={boxStyle}>
          <p>{t('This content is protected by a watermark.', 'このコンテンツにはウォーターマークが付与されています。')}</p>
          <p>{t('The overlay is decorative and does not affect accessibility.', 'オーバーレイは装飾のみで、アクセシビリティには影響しません。')}</p>
        </div>
      </Watermark>
    );
  },
};

/** Custom rotation and opacity. */
export const CustomAngle: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Watermark text={t('Draft', '下書き')} rotate={-45} opacity={0.08}>
        <div style={boxStyle}>
          <p>{t('Rotated at −45° with reduced opacity.', '−45° 回転、低い不透明度。')}</p>
        </div>
      </Watermark>
    );
  },
};

/** Custom gap between tiles. */
export const CustomGap: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Watermark text={t('Internal', '内部限定')} gap={[40, 20]}>
        <div style={{ ...boxStyle, minHeight: '200px' }}>
          <p>{t('Tighter tile gap.', 'タイル間隔を狭くした例。')}</p>
        </div>
      </Watermark>
    );
  },
};
