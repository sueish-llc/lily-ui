import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Data Display/Chip',
  component: Chip,
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof Chip>;

export const Statuses: Story = {
  render: () => (
    <div className="lily-flex lily-gap-2 lily-items-center">
      {(['primary', 'info', 'success', 'warning', 'danger', 'neutral'] as const).map((s) => (
        <Chip key={s} status={s}>
          {s}
        </Chip>
      ))}
    </div>
  ),
};

export const Selectable: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Chip clickable selected>
        {t('Filter', '絞り込み')}
      </Chip>
    );
  },
};

export const Removable: Story = {
  render: () => <Chip onRemove={() => {}}>ada@example.com</Chip>,
};
