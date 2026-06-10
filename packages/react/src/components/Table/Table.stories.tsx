import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import { makeT, type StoryLocale } from '../../storybook/i18n';

const meta = {
  title: 'Data Display/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: (_args, { globals }) => {
    const t = makeT(globals.locale as StoryLocale);
    return (
      <Table striped hover caption={t('Quarterly revenue', '四半期売上')}>
        <thead>
          <tr>
            <th scope="col">{t('Quarter', '四半期')}</th>
            <th scope="col">{t('Revenue', '売上')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Q1</td>
            <td>¥100M</td>
          </tr>
          <tr>
            <td>Q2</td>
            <td>¥140M</td>
          </tr>
        </tbody>
      </Table>
    );
  },
};
