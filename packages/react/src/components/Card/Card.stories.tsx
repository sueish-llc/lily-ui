import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Data Display/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <div style={{ maxWidth: 360 }}>
        <Card elevated>
          <Card.Header>{t('Featured', '注目')}</Card.Header>
          <Card.Body>
            <Card.Title>{t('Card title', 'カードのタイトル')}</Card.Title>
            <p className="lily-text-muted">{t('Supporting body text for the card.', 'カードの本文テキスト。')}</p>
            <Button>{t('Action', 'アクション')}</Button>
          </Card.Body>
          <Card.Footer>{t('Footer', 'フッター')}</Card.Footer>
        </Card>
      </div>
    );
  },
};
