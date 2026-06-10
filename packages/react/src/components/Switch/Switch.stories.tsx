import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return <Switch label={t('Enable notifications', '通知を有効にする')} defaultChecked />;
  },
};
