import type { Meta, StoryObj } from '@storybook/react';
import { ListGroup } from './ListGroup';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Data Display/List Group',
  component: ListGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ListGroup>;

export default meta;
type Story = StoryObj<typeof ListGroup>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <ListGroup style={{ maxWidth: 320 }}>
        <ListGroup.Item active>{t('Active item', 'アクティブな項目')}</ListGroup.Item>
        <ListGroup.Item>{t('Second item', '2 番目の項目')}</ListGroup.Item>
        <ListGroup.Item action>{t('Action item', 'アクション項目')}</ListGroup.Item>
        <ListGroup.Item disabled>{t('Disabled item', '無効な項目')}</ListGroup.Item>
      </ListGroup>
    );
  },
};
