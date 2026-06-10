import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Actions/Button Group',
  component: ButtonGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <ButtonGroup label={t('Text alignment', 'テキストの揃え')}>
        <Button variant="outline">{t('Left', '左')}</Button>
        <Button variant="outline">{t('Center', '中央')}</Button>
        <Button variant="outline">{t('Right', '右')}</Button>
      </ButtonGroup>
    );
  },
};
