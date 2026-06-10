import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Disclosure/Accordion',
  component: Accordion,
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Accordion
        defaultOpen={['1']}
        items={[1, 2, 3].map((n) => ({
          id: String(n),
          header: t(`Section ${n}`, `セクション ${n}`),
          content: t(`Content for section ${n}.`, `セクション ${n} の内容。`),
        }))}
      />
    );
  },
};
