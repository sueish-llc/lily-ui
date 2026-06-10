import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Overlay/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Dropdown trigger={<Button>{t('Options', 'オプション')} ▾</Button>}>
        <Dropdown.Item>{t('Edit', '編集')}</Dropdown.Item>
        <Dropdown.Item>{t('Duplicate', '複製')}</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>{t('Delete', '削除')}</Dropdown.Item>
      </Dropdown>
    );
  },
};
