import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const Search = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M11 4a7 7 0 1 0 4.2 12.6l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
    />
  </svg>
);

const meta = {
  title: 'Media/Icon',
  component: Icon,
  tags: ['autodocs'],
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Icon label={t('Search', '検索')}>
        <Search />
      </Icon>
    );
  },
};

export const Sizes: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div className="lily-flex lily-gap-4 lily-items-center">
        {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
          <Icon key={s} size={s} label={`${t('Search', '検索')} ${s}`}>
            <Search />
          </Icon>
        ))}
      </div>
    );
  },
};

export const Tones: Story = {
  render: () => (
    <div className="lily-flex lily-gap-4 lily-items-center">
      {(['primary', 'accent', 'muted', 'danger', 'success', 'info'] as const).map((tone) => (
        <Icon key={tone} size="lg" tone={tone} label={tone}>
          <Search />
        </Icon>
      ))}
    </div>
  ),
};
