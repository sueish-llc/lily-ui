import type { Meta, StoryObj } from '@storybook/react';
import { FloatingLabel } from './FloatingLabel';
import { Input } from '../Input';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Floating Label',
  component: FloatingLabel,
  tags: ['autodocs'],
} satisfies Meta<typeof FloatingLabel>;

export default meta;
type Story = StoryObj<typeof FloatingLabel>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ maxWidth: 360 }}>
        <FloatingLabel label={t('Email address', 'メールアドレス')}>
          <Input type="email" />
        </FloatingLabel>
      </div>
    );
  },
};
