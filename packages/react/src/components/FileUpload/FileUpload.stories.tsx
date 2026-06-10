import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload } from './FileUpload';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/File Upload',
  component: FileUpload,
  tags: ['autodocs'],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ maxWidth: 420 }}>
        <FileUpload multiple accept="image/*" hint={t('PNG / JPG, up to 5MB', 'PNG / JPG（最大 5MB）')} id="sb-upload" />
      </div>
    );
  },
};

export const Single: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ maxWidth: 420 }}>
        <FileUpload label={t('Choose one file', 'ファイルを 1 つ選択')} />
      </div>
    );
  },
};
