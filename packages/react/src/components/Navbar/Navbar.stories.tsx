import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from './Navbar';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  args: { brand: 'Lily UI' },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  render: (args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Navbar {...args}>
        <a className="lily-nav__link" href="#docs">
          {t('Docs', 'ドキュメント')}
        </a>
        <a className="lily-nav__link" href="#components">
          {t('Components', 'コンポーネント')}
        </a>
        <a className="lily-nav__link" href="#about">
          {t('About', '概要')}
        </a>
      </Navbar>
    );
  },
};
