import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Container>
        <div className="lily-p-3 lily-bg-subtle lily-rounded-md" style={{ textAlign: 'center' }}>
          {t('A centered, max-width container', '中央寄せ・最大幅つきのコンテナ')}
        </div>
      </Container>
    );
  },
};
