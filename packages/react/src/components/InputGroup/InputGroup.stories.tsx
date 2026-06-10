import type { Meta, StoryObj } from '@storybook/react';
import { InputGroup } from './InputGroup';
import { Input } from '../Input';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Input Group',
  component: InputGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Addons: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div className="lily-vstack lily-gap-3" style={{ maxWidth: 360 }}>
        <InputGroup>
          <InputGroup.Addon>@</InputGroup.Addon>
          <Input aria-label={t('Username', 'ユーザー名')} placeholder={t('username', 'ユーザー名')} />
        </InputGroup>
        <InputGroup>
          <Input aria-label={t('Amount', '金額')} placeholder="0.00" />
          <InputGroup.Addon>JPY</InputGroup.Addon>
        </InputGroup>
      </div>
    );
  },
};
